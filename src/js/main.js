document.addEventListener('DOMContentLoaded', function() {
  $(".imgInp").change(function(){
      readURL(this);
  });

  // If the comparison slider is present on the page lets initialise it, this is good you will include this in the main js to prevent the code from running when not needed
  if ($(".compare-slider")[0]) {
    var compSlider = $(".compare-slider");

    //let's loop through the sliders and initialise each of them
    compSlider.each(function() {
      var compSliderWidth = $(this).width() + "px";
      $(this).find(".resize img").css({ width: compSliderWidth });
      drags($(this).find(".divider"), $(this).find(".resize"), $(this));
    });

    //if the user resizes the windows lets update our variables and resize our images
    $(window).on("resize", function() {
      var compSliderWidth = compSlider.width() + "px";
      compSlider.find(".resize img").css({ width: compSliderWidth });
    });
  }

  var compareZoom = document.querySelector('.compare-zoom');
  if (compareZoom) {
    var compareZoomFrames = [].slice.call(compareZoom.querySelectorAll('.imgBg'));
    compareZoomFrames.forEach(function(frame) {
      moves(frame, compareZoomFrames);
    });
  }

});

function readURL(input, outputSelector) {
  if (input.files && input.files[0]) {
    var id = input.dataset.id;
    var reader = new FileReader();
    reader.onload = function (e) {
      document.querySelector('#imgOut' + id).src = e.target.result;
      document.querySelector('.imgBg--' + id).style.backgroundImage = 'url(' + e.target.result + ')';
    };
    document.querySelector('#title' + id).innerHTML = input.files[0].name;
    reader.readAsDataURL(input.files[0]);
  }
}

function drags(dragElement, resizeElement, container) {
	var touched = false;
	window.addEventListener('touchstart', function() {
		touched = true;
	});
	window.addEventListener('touchend', function() {
		touched = false;
	});

	dragElement.on("mousedown touchstart", function(e) {
		dragElement.addClass("draggable");
		resizeElement.addClass("resizable");
		var startX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
		var dragWidth = dragElement.outerWidth();
		var posX = dragElement.offset().left + dragWidth - startX;
		var containerOffset = container.offset().left;
		var containerWidth = container.outerWidth();
		var minLeft = containerOffset + 10;
		var maxLeft = containerOffset + containerWidth - dragWidth - 10;

		dragElement.parents().on("mousemove touchmove", function(e) {

			// if the user is not using touch input let do preventDefault to prevent the user from slecting the images as he moves the silder arround.
			if ( touched === false ) {
				e.preventDefault();
			}

			var moveX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
			var leftValue = moveX + posX - dragWidth;

			// stop the divider from going over the limits of the container
			if (leftValue < minLeft) {
				leftValue = minLeft;
			} else if (leftValue > maxLeft) {
				leftValue = maxLeft;
			}

			var widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + "%";

			$(".draggable").css("left", widthValue).on("mouseup touchend touchcancel", function() {
				$(this).removeClass("draggable");
				resizeElement.removeClass("resizable");
			});

			$(".resizable").css("width", widthValue);

		}).on("mouseup touchend touchcancel", function() {
			dragElement.removeClass("draggable");
			resizeElement.removeClass("resizable");
		});

	}).on("mouseup touchend touchcancel", function(e) {
		dragElement.removeClass("draggable");
		resizeElement.removeClass("resizable");
	});

}

function moves(frame, frames) {
	var touched = false;
	window.addEventListener('touchstart', function() {
		touched = true;
	});
	window.addEventListener('touchend', function() {
		touched = false;
	});
  var isMoving = false;
  var bgPositionX;
  var bgPositionY;
  var startX;
  var startY;

	$(frame).on("mousedown touchstart", function(e) {
    isMoving = true;
		startX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
    startY = e.pageY ? e.pageY : e.originalEvent.touches[0].pageY;
    bgPositionX = parseFloat(getComputedStyle(frame).backgroundPositionX);
    bgPositionY = parseFloat(getComputedStyle(frame).backgroundPositionY);
	}).on("mousemove touchmove", function(e) {
    if ( touched === false ) {
      e.preventDefault();
    }
    if ( isMoving === false ) {
      return false;
    }

    var moveX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
    var moveY = e.pageY ? e.pageY : e.originalEvent.touches[0].pageY;
    frames.forEach(function(frame) {
      frame.style.backgroundPositionX = bgPositionX + moveX - startX + 'px';
      frame.style.backgroundPositionY = bgPositionY + moveY - startY + 'px';
    });
  }).on("mouseup touchend touchcancel", function(e) {
		isMoving = false;
	});

}
