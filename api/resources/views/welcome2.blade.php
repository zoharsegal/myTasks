<!DOCTYPE html>
<html>
<body>
<style>
    span {
        min-width: 100px;
        display: inline-block;
    }


</style>

<script>
    function ddd() {
        ffff=document.getElementById('formaction').value ;
        console.log(ffff);
        document.getElementsByTagName('form')[0].setAttribute('action',ffff);
    }
</script>
<form action="/example/public/user/register" method="post" enctype="multipart/form-data">

    <br><span>email:</span><input type="text" name="email" id="email" value="">
    <br><span>password:</span><input type="text" name="password" id="password" value="">
    <br><span>user Name:</span><input type="text" name="userName" id="userName" value="">
    <br><span>taskName:</span><input type="text" name="taskName" id="taskName" value="">
    <br><span>taskId:</span><input type="text" name="taskId" id="taskId" value="">
    <br><span>userIds:</span><input type="text" name="userIds" id="userIds" value="">
    <br><span>isDone:</span><input type="text" name="isDone" id="isDone" value="">
    <input type="hidden" name="_token" value="{{ csrf_token() }}">
    <br><input type="submit" value="Upload Image" name="submit">
</form>

<input type="text" name="formaction" id="formaction" value="/example/public/user/register" style="width:20%;">
<input type="submit" value="change action url" name="submit2" onClick="ddd()">
</body>
</html>
