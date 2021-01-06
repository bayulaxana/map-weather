<?php

use Illuminate\Support\Facades\Route;

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

Route::get('/', function() {
    return redirect( url('/map') );
});

Route::get('/weather', function () {
    return view('weather');
});

Route::get('/direction', function() {
    return view('direction');
});

Route::get('/map', function() {
    return view('fullmap');
});
