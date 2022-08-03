@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div>{{ __('My Articles') }}</div>
          <div>
            <a href="#" class="btn btn-primary ml-auto" role="button">add</a>
          </div>
        </div>

        <div class="card-body">
          <div class="row g-2">
            @for($i=1; $i<=9 ; $i++) 
            <div class="col-sm-4">
              <div class="card" style="width: auto;">
                <img src="..." class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">Card title</h5>
                  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
              </div>
          </div>
          @endfor
        </div>
      </div>
    </div>
  </div>
</div>
</div>
@endsection