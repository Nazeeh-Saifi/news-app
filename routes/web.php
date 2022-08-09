<?php

use App\Http\Controllers\ArticleController;
use App\Models\Article;
use Illuminate\Support\Facades\Auth;
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

Route::get('/', function () {
    $articles = Article::with('user')->latest()->paginate(9);
    return view('welcome', ['articles' => $articles]);
})->name('welcome');

Route::get('/articles/{slug}', function ($slug) {
    $article = Article::where('slug', $slug)->firstOrFail();
    // dd($slug, request(), $article);
    return view('article-slug', ['article' => $article]);
})->name('articles.slug');

Auth::routes(['reset' => false, 'confirm' => false]);

// Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::group(['prefix' => 'admin/articles', 'as' => 'articles.', 'middleware' => 'auth'], function () {
    Route::get('/', [ArticleController::class, 'index'])->name('index');
    Route::get('/create', [ArticleController::class, 'create'])->name('create');
    Route::post('/', [ArticleController::class, 'store'])->name('store');
    Route::get('/{article}', [ArticleController::class, 'show'])->name('show');
});