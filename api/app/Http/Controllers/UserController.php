<?php namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use DB;

class UserController extends Controller {


    /**
     * login using email and password
     */

    private function sessionCheck($uuid) {
        if (empty($uuid)) {
            return false;
        }
        $user = DB::table('sessions')->where([
            ['uuid', '=', $uuid],
        ])->first();
        if ($user) {
            return $user;;
        } else {
            return false;
        }
    }

    private function sessionCreate($userId,$userName) {
        $uuid=uniqid();
        DB::delete('DELETE FROM sessions WHERE `userId` = ?', [$userId]);
        //delete old session(more than 1 days old)
        DB::delete('DELETE FROM sessions WHERE `insertDate` < (DATE_SUB(NOW(), INTERVAL 1 DAY))', []);
        DB::insert('INSERT INTO sessions (`userId`,`userName`, `uuid`) VALUES (?, ?, ?)', [$userId,$userName,$uuid]);
        return $uuid;
    }

    public function checkLogin(Request $request)
    {
        $user=$this->sessionCheck($request->header('uuid'));
        if ($user)
        {
            return '{"status":"OK","userName":"' . $user->userName . '","uuid":"' . $user->uuid . '"}';
        } else {
            return '{"status":"Not Logged In"}';
        }

    }

    public function login(Request $request)
    {
        if (!$this->sessionCheck($request->header('uuid')))
        {
            $user = DB::table('users')->where('email', $request->input('email'))->first();
            if ($user) {
                if (password_verify($request->input('password'),$user->password)) {
                    $uuid=$this->sessionCreate($user->id,$user->userName);
                    return '{"status":"OK","userName":"' . $user->userName . '","uuid":"' . $uuid . '"}';
                } else {
                    return '{"status":"Invalid Credentials"}';
                }
            } else {
                return '{"status":"Invalid Credentials"}';
            }
        } else {
            return '{"status":"Already Logged In"}';
        }

    }
    /**
     * register with userName,email and password
     */
    public function register(Request $request)
    {
        if (!$this->sessionCheck($request->header('uuid')))
        {
            /*
             * Verify Input Start
             */
            $email = filter_var( $request->input('email'), FILTER_VALIDATE_EMAIL );
            if(empty($request->input('email')) || empty($request->input('password')) || empty($request->input('userName'))) {
                return '{"status":"Missing Parameters"}';
            }
            if(!$email) {
                return '{"status":"Email Invalid"}';
            }
            $users = DB::select('SELECT 1 FROM users WHERE email = ?', [$email]);
            if (count($users)>0) {
                return '{"status":"Email Exists"}';
            }

            /*
             * Insert Into Db
             */
            $encPass=bcrypt($request->input('password'));
            DB::insert('INSERT INTO users (`email`, `password`,`userName`) VALUES (?, ?, ?)', [$request->input('email'), $encPass,$request->input('userName')]);
            /*
             * Get UserId From Db
             */
            $user = DB::table('users')->where('email', $email)->first();

            $uuid=$this->sessionCreate($user->id,$user->userName);
            return '{"status":"OK","userName":"' . $user->userName . '","uuid":"' . $uuid . '"}';
        } else {
            return '{"status":"Already Logged In"}';
        }


    }

    /**
     * logout
     */
    public function logout(Request $request)
    {
        if ($this->sessionCheck($request->header('uuid')))
        {
            DB::delete('DELETE FROM sessions WHERE `uuid` = ?', [$request->header('uuid')]);
            return '{"status":"OK"}';
        } else {
            return '{"status":"Not Logged In"}';
        }
    }



}
