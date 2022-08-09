@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div>{{ __('Create New Article') }}</div>
        </div>

        <div class="card-body">
          <form id="article-store" method="post" class="row" action="{{ route('articles.store') }}" enctype="multipart/form-data">
            @csrf

            <div class="col-12 mb-3">
              <label for="title" class="form-label">{{ __('Title') }}</label>
              <input id="title" type="text" class="form-control @error('title') is-invalid @enderror" name="title" value="{{old('title')}}" autocomplete="title">
              @error('title')
              <span class="invalid-feedback" role="alert">
                <strong>{{ $message }}</strong>
              </span>
              @enderror
            </div>
            <div class="col-12 mb-3">
              <label for="article-content" class="form-label">{{ __('Content') }}</label>
              <div id="content" class="form-control @error('content') is-invalid @enderror"></div>
              @error('content')
              <span class="invalid-feedback" role="alert">
                <strong>{{ $message }}</strong>
              </span>
              @enderror
            </div>

            <div class="col-12 d-grid gap-2 d-md-flex justify-content-md-end">
              <a href="{{ route('articles.index') }}" class="btn btn-danger" role="button">{{ __('Cancel') }}</a>
              <button id="submit" type="submit" class="btn btn-success btn-block">
                {{ __('Add New Article') }}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      </div>
      {{-- <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">insert</button>
      </div> --}}
    </div>
  </div>
</div>
@endsection

@push('scripts')
<script type="text/javascript">
window.addEventListener('load', function() {
  //
  const {
    EditorJS,
    Header,
    List,
    GifImage
  } = window.editor;

  try {
    //old editor data when validation fails
    var oldData = JSON.parse({{Illuminate\Support\Js::from(old('content'))}});

  } catch (error) {
    console.error('json parsing error');
  }

  window.selectedImagesUrls =[];
  window.editorJs = new EditorJS({
    /**
     * Id of Element that should contain the Editor
     */
    holder: "content",

    /**
     * Available Tools list.
     * Pass Tool's class or Settings object for each Tool you want to use
     */
    tools: {
      header: {
        class: Header,
        inlineToolbar: true
      },
      list: List,
      image: {
        class: GifImage,
      }
    },

    data: oldData?.blocks.length > 0 ? oldData : {}
  });

  console.log(oldData);
  // this add a hidden input to store the data of the editor in and submit it to backend
  $('#article-store').submit(function(e) {

    editorJs.save().then((outputData) => {
      console.error('Article data: ', outputData)

      if (outputData.blocks.length > 0) {
        $("<input />").attr("type", "hidden")
          .attr("name", "content")
          .attr("value", JSON.stringify(outputData))
          .appendTo(this);
      }
    }).catch((error) => {
      console.error('Saving failed: ', error)
    });
  });


  // attaching event listener that will remove the images from modal when hiding it
  const modal = document.getElementById("myModal");
  modal.addEventListener("hidden.bs.modal", function (event) {
      // console.log(event);
      this.querySelector(".gif-selector")?.remove();
      window.selectedImagesUrls =[] ;
  });

  });
</script>
@endpush