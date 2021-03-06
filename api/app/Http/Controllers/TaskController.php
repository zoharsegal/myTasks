<?php namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DB;

class TaskController extends Controller {

    private function sessionCheck($uuid) {
        if (empty($uuid)) {
            return false;
        }
        $user = DB::table('sessions')->where([
            ['uuid', '=', $uuid],
        ])->first();
        if ($user) {
            return $user;
        } else {
            return false;
        }
    }
    /*
     *  Private function
     * list of tasks(owned and shared)
     */
    private function getList($userId,$taskId) {
        $query='SELECT  T.`id`
                        ,`taskName`
                        ,T.`userId`
                        ,`isDone`
                        ,(CASE WHEN (SELECT COUNT(1) FROM `tasksharing` WHERE `taskId`=T.id)=0 THEN 0 ELSE 1 END) `isShared`
                        ,(CASE WHEN TS.`userId` IS NULL THEN 1 ELSE 0 END) `isOwner`
                        ,TS1.`shares`
                 FROM `tasks` T LEFT OUTER JOIN `tasksharing` TS
                 ON T.id = TS.`taskId`
                 AND TS.`userId` = ?
                 LEFT OUTER JOIN (
                     SELECT T1.id `taskId`,CONCAT(\'[\',GROUP_CONCAT(
                         JSON_OBJECT(\'userId\', U1.`id`,\'userName\', U1.`userName`,\'isShared\', (CASE WHEN TS1.`id` IS NULL THEN 0 ELSE 1 END))
                         SEPARATOR \',\'),\']\') shares
                     FROM tasks T1
                     LEFT OUTER JOIN users U1
                     ON 1=1
                     LEFT OUTER JOIN tasksharing TS1
                     ON U1.id=TS1.`userId`
                     AND T1.id=TS1.`taskId`
                     WHERE U1.id<> ?
                     GROUP BY T1.id
                 ) TS1
                 ON T.id=TS1.`taskId`
                 WHERE (IFNULL(TS.`userId`,T.userId) = ?)';
        $singleRowQuery=' AND T.id = ? ';
        if ($taskId) {
            $tasks = DB::select($query . $singleRowQuery . ' ORDER BY `insertDate`', [$userId,$userId,$userId,$taskId]);
            if (count($tasks)>0) {
                $singleArray=array("id" => $tasks[0]->id,"type" => "tasks","attributes" => array("task-name" => $tasks[0]->taskName,"is-done" => $tasks[0]->isDone,"is-shared" => $tasks[0]->isShared,"is-owner" => $tasks[0]->isOwner,"shares" => json_decode($tasks[0]->shares)));
            } else {
                $singleArray=array();
            }
            $finalJson=array("status" => "OK","data" => $singleArray);

        } else {
            $tasks = DB::select($query . ' ORDER BY `insertDate`', [$userId,$userId,$userId]);
            $jsonArray=array();
            foreach ($tasks as $task) {
                array_push($jsonArray,array("id" => $task->id,"type" => "tasks","attributes" => array("task-name" => $task->taskName,"is-done" => $task->isDone,"is-shared" => $task->isShared,"is-owner" => $task->isOwner,"shares" => json_decode($task->shares))));
            }
            $finalJson=array("status" => "OK","data" => $jsonArray);
        }
        return $finalJson;
    }



    /**
     * list of tasks(owned and shared)
     * taskId is optional, if not exists will return all tasks related to user or shared with him
     */
    public function list(Request $request,$id = null)
    {
        $userId=$this->sessionCheck($request->header('uuid'))->userId ?? null;
        if ($userId)
        {
            //getting all tasks, and sharing list with 1 query
            return json_encode($this->getList($userId,$id));
        } else {
            return '{"errors":[{"name":"ERROR","description":"Not Logged In"}]}';
        }

    }

    /**
     * update task Done/Undone
     */
    public function update(Request $request,$id)
    {

        $parms=json_decode(file_get_contents('php://input'));
        $isDone = ($parms->data->attributes->{'is-done'} ? "1" : "0");
        $userId=$this->sessionCheck($request->header('uuid'))->userId;
        if ($userId)
        {
            $user = DB::select('SELECT 1
                                 FROM `tasks` T LEFT OUTER JOIN `tasksharing` TS
                                 ON T.id = TS.`taskId`
                                 AND T.id = ?
                                 AND TS.`userId` = ?
                                 WHERE (IFNULL(TS.`userId`,T.userId) = ?)
                                 ORDER BY `insertDate`', [$id,$userId,$userId]);
            if($isDone<>"0" && $isDone<>"1") {
                return '{"status":"Invalid Parameters"}';
            }
            if (count($user)>0) {
                DB::update('UPDATE tasks SET `isDone` = ? WHERE `id` = ?', [$isDone,$id]);
                //updating shares
                if ($parms->data->attributes->shares) {
                    $shares=$parms->data->attributes->shares;
                } else {
                    $shares=array();
                }
                $usersToDeleteShare="";
                $usersToAddShare="";
                foreach ($shares as $share) {
                    if ($share->isShared==1) {
                        $usersToAddShare.= $share->userId . ',';
                    } else {
                        $usersToDeleteShare.= $share->userId . ',';
                    }
                }
                $usersToAddShare=rtrim($usersToAddShare, ",");;
                $usersToDeleteShare=rtrim($usersToDeleteShare, ",");
//                return $usersToDeleteShare;
                if ($usersToAddShare<>"") {
                    DB::statement('INSERT INTO tasksharing(`userId`,`taskId`)
                                    SELECT id,' . $id . '
                                    FROM users U
                                    WHERE `id` IN(' . $usersToAddShare . ')
                                    AND NOT EXISTS(SELECT 1 FROM tasksharing WHERE `taskId`=' . $id . ' AND `userId` IN(' . $usersToAddShare . '))');
                }
                if ($usersToDeleteShare<>"") {
                    DB::statement('DELETE FROM tasksharing WHERE `taskId` = ' . $id . ' AND `userId` IN(' . $usersToDeleteShare . ')');
                }
                return json_encode($this->getList($userId,$id));
            } else {
                return '{"errors":[{"name":"ERROR2","description":"Permission Denied"}]}';
            }
        } else {
            return '{"errors":[{"name":"ERROR","description":"Not Logged In"}]}';
        }
    }

    /**
     * Insert new task
     */
    public function insert(Request $request)
    {
        $parms=json_decode(file_get_contents('php://input'));
        $taskName = $parms->data->attributes->{'task-name'};
        $userId=$this->sessionCheck($request->header('uuid'))->userId;
        if ($userId)
        {
            if(empty($taskName)) {
                return '{"status":"Empty Task Name"}';
            }
            $id = DB::table('tasks')->insertGetId([
                'userId' => $userId,
                'taskName' => $taskName
            ]);
            return json_encode($this->getList($userId,$id));
        } else {
            return '{"errors":[{"name":"ERROR","description":"Not Logged In"}]}';
        }

    }

    /**
     * Delete task, and shared user records
     */
    public function delete(Request $request,$id)
    {
        $userId=$this->sessionCheck($request->header('uuid'))->userId;
        if ($userId)
        {
            $user = DB::table('tasks')->where([
                ['id', '=', $id],
                ['userId', '=', $userId],
            ])->first();
            if ($user) {
                DB::delete('DELETE FROM tasks WHERE `id` = ?', [$id]);
                DB::delete('DELETE FROM `tasksharing` WHERE `taskId` = ?', [$id]);
                return response(null, 204);
            } else {
                return array("errors" => array("Permission Denied"),"data" => array());
            }

        } else {
            return '{"errors":[{"name":"ERROR","description":"Not Logged In"}]}';
        }
    }

    /**
     * get tasks statistics
     */
    public function getStats(Request $request)
    {
        $userId=$this->sessionCheck($request->header('uuid'));
        if ($userId)
        {
            $userData = DB::select('SELECT IFNULL(SUM(CASE WHEN `isDone`=1 THEN 1 ELSE 0 END),0) `totalDone`,IFNULL(SUM(CASE WHEN `isDone`=0 THEN 1 ELSE 0 END),0) `totalUnDone`
                                    FROM tasks T LEFT OUTER JOIN tasksharing TS
                                    ON T.id=TS.`taskId`
                                    AND TS.`userId` = ?
                                    WHERE IFNULL(TS.`userId`,T.`userId`) = ?', [$userId->userId,$userId->userId]);
            return '{"data":[{"id":1,"type": "userdatas","attributes":{"total-done":' . $userData[0]->totalDone . ',"total-un-done":' . $userData[0]->totalUnDone . ',"total-tasks":' . ($userData[0]->totalDone + $userData[0]->totalUnDone) . '}}]}';
        } else {
            return '{"errors":[{"name":"ERROR","description":"Not Logged In"}]}';
        }
    }


}
