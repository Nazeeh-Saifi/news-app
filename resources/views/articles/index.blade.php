@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-12">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div>{{ __('My Articles') }}</div>
          <div>
            <a href="{{ route('articles.create') }}" class="btn btn-primary ml-auto" role="button">create</a>
          </div>
        </div>

        <div class="card-body">
          {{-- alert success --}}
          @if(session('success'))
          <div class="alert alert-success alert-dismissible fade show" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
            </svg>
            {{__('Article created successfully!!')}}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
          @endif
          {{-- articles cards --}}
          <div class="row g-2">
            @foreach ($articles as $article)
            <div class="col-sm-4">
              <div id="articles-cards" class="card" style="width: auto;">
                {{-- <img src="https://via.placeholder.com/150" class="card-img-top" alt="..."> --}}
                <div class="card-body">
                  <h5 class="card-title"><a href="{{route('articles.show', ['article' => $article->id])}}">{{$article->title}} </a></h5>
                  <p class="card-text"><small class="text-muted">by: {{$article->user->name }}</small></p>
                  <p class="card-text"><small class="text-muted">Created: {{$article->created_at->diffForHumans() }}</small></p>
                  <p class="card-text"><small class="text-muted">Last updated {{$article->updated_at->diffForHumans() }}</small></p>

                </div>
              </div>
            </div>
            @endforeach
          </div>
      </div>
      <div class="card-footer">
        {{ $articles }}
      </div>
    </div>
  </div>
</div>
</div>
@endsection