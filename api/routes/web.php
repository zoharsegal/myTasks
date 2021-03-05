<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/check', function () {
    return view('welcome2');
});

Route::get('/tasks/{id?}', 'TaskController@list');

Route::get('/userdatas', 'TaskController@getStats');

Route::delete('/tasks/{id}', 'TaskController@delete');

Route::patch('/tasks/{id}', 'TaskController@update');

Route::post('/tasks', 'TaskController@insert');

Route::post('/user/login', 'UserController@login');

Route::post('/user/logout', 'UserController@logout');

Route::post('/user/register', 'UserController@register');

Route::post('/user/checkLogin', 'UserController@checkLogin');

//Route::post('/task/taskShareList', 'TaskController@taskShareList');

//Route::post('/task/shareTask', 'TaskController@shareTask');
