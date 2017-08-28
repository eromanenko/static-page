document.addEventListener('DOMContentLoaded', function() {
  $(".imgInp").change(function(){
      readURL(this);
  });

  setOrientation();

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
window.addEventListener("resize", function() {
  setOrientation();
}, false);

var images = {
  1: {
    src: 'http://egegorgulu.com/assets/img/beforeafter/before.jpg',
    width: 1200,
    height: 675
  },
  2: {
    src: 'http://egegorgulu.com/assets/img/beforeafter/after.jpg',
    width: 1200,
    height: 675
  }
};

function setOrientation() {
  if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
    document.querySelector('.compare-zoom').classList.add('horizontal');
  } else {
    document.querySelector('.compare-zoom').classList.remove('horizontal');
  }
}

function readURL(input, outputSelector) {
  if (input.files && input.files[0]) {
    var id = input.dataset.id;
    images[id] = {};

    // var img = document.createElement("img");
    // img.onload = function() {
    //   window.URL.revokeObjectURL(this.src);
    //   console.log(this);
    //     images[id].src = e.target.result;
    //     document.querySelector('#imgOut' + id).src = images[id].src;
    //     document.querySelector('.imgBg--' + id).style.backgroundImage = 'url(' + images[id].src + ')';
    //
    // };
    // img.src = window.URL.createObjectURL(input.files[0]);


    var reader = new FileReader();
    reader.onload = function (e) {
      images[id].src = e.target.result;
      document.querySelector('#imgOut' + id).src = images[id].src;
      document.querySelector('.imgBg--' + id).style.backgroundImage = 'url(' + images[id].src + ')';

      var image  = new Image();
      image.addEventListener("load", function () {
        images[id].width = image.width;
        images[id].height = image.height;
      });

      image.src = e.target.result;

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
  var id = frame.dataset.id;
  var isMoving = false;
  var bgPositionX;
  var bgPositionY;
  var startX;
  var startY;
  var trottling = false;

	$(frame).on("mousedown touchstart", function(e) {
    isMoving = true;
		startX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
    startY = e.pageY ? e.pageY : e.originalEvent.touches[0].pageY;
    bgPositionX = parseFloat(getComputedStyle(frame).backgroundPositionX);
    bgPositionY = parseFloat(getComputedStyle(frame).backgroundPositionY);
    $(window).on("mousemove.drag touchmove.drag", function(e) {
      // console.log(trottling);
      if ( !touched ) {
        e.preventDefault();
      }
      if ( !isMoving || trottling) {
        return false;
      }
      trottling = true;
      setTimeout(function() {trottling = false;}, 100);

      var moveX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
      var moveY = e.pageY ? e.pageY : e.originalEvent.touches[0].pageY;
      var minOffsetX = frame.offsetWidth - images[id].width;
      var maxOffsetX = 0;
      var minOffsetY = frame.offsetHeight - images[id].height;
      var maxOffsetY = 0;
      var newPositionX = bgPositionX + moveX - startX;
      if (newPositionX < minOffsetX) newPositionX = minOffsetX;
      if (newPositionX > 0) newPositionX = 0;
      var newPositionY = bgPositionY + moveY - startY;
      if (newPositionY < minOffsetY) newPositionY = minOffsetY;
      if (newPositionY > 0) newPositionY = 0;
      var bgString = newPositionX + 'px ' + newPositionY + 'px';
      frames.forEach(function(frame) {
        frame.style.backgroundPosition = bgString;
      });
    });
	}).on("mouseup touchend touchcancel", function(e) {
		isMoving = false;
    $(window).off('mousemove.drag touchmove.drag');
	});

}
