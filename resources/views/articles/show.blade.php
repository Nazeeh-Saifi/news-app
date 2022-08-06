@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div>{{ $article->title }}</div>

          <div>
            <a href="{{ route('articles.index') }}" class="btn btn-secondary ml-auto" role="button">back</a>
          </div>
        </div>

        <div class="card-body">
          {!!$article->html_content!!}
        </div>
      </div>
    </div>
  </div>
</div>
@endsection