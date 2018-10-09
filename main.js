function bubbleSortingClass(options) {
	// Пустой объект по дефолту
	options = options || {};
	// Переменная для обращения внутренних методов к объекту
	var self = this;
	// Параметры массива случайных чисел
	var minValue = (options.min == undefined) ? -10 : options.min,
		 maxValue = (options.max == undefined) ? 10 : options.max,
		 arraySize = 10;
	var timeoutID, intervalID, $bubble1, $bubble2, step, i;
	// Приватное свойство хранящее массив случайных чисел
	this._arrayOfRandomIntegers = [];
	this.$conteiner1 = $('.conteiner .bubbleForSort');
	this.$conteiner2 = $('.conteiner .firstBubble');
   
	// Внутренняя функция генерирующая массив случайных чисел
	function getArrayOfRandomIntegers () {
		var resultArray = [];
		for (var i = 0; i < arraySize; i++) {
			resultArray.push(Math.floor(Math.random() * (maxValue - minValue) + minValue)); 	
		}
		self._arrayOfRandomIntegers = resultArray;
		return resultArray;
	}

	// Внешняя функция генерирующая и выводящая шарики на экран
	this.createAndShowBubble = function () {
		clearTimeout(timeoutID);
	   clearInterval(intervalID);
		step = 1;
		count = 10;
		var side;
		var array = getArrayOfRandomIntegers();
		for (var i = 0; i < array.length; i++) {
			generateBubble(self.$conteiner1, 'bubble', array[i], i);
			generateBubble(self.$conteiner2, 'clone', array[i], i);
		}
	}

	function generateBubble ($conteiner, className, element, id) {
		var side = element * 2 + 80;
		var classN = "." + className;
		$conteiner.append('<div class="' + className + '">' + element + '</div>');
		$conteiner.find(classN)
				.eq(id)
				.width(side)
				.height(side)
				.css('lineHeight', side + 'px');
	}

	// Внешняя функция сортировки массива
	this.bubbleSort = function bubbleSort () {
		if (step <= self._arrayOfRandomIntegers.length) {
	      step++;
	      i = 0;

	      (function sorting () {
	      	if (i < 10) {
	      		$bubble1 = $('.bubble:eq(' + i + ')');
	      		$bubble2 = $('.bubble:eq(' + (i + 1) + ')');
	      		$lastbubble = $('.bubble:eq(' + count + ')')
	      		if (self._arrayOfRandomIntegers[i] > self._arrayOfRandomIntegers[i + 1]) {
	            	[self._arrayOfRandomIntegers[i], self._arrayOfRandomIntegers[i + 1]] = [self._arrayOfRandomIntegers[i + 1], self._arrayOfRandomIntegers[i]];		      		 	
	            	swapBubble($bubble1, $bubble2);
	      		 	timeoutID = setTimeout(sorting, 1000);
	            } else {
	            	timeoutID = setTimeout(sorting, 0);
	            }
	            i++;
	      	} else {
	      		clearInterval(intervalID);
	      		bubbleSort();
	      		intervalID = setInterval(bubbleSort, 10000);
	      	}
	      })();
	   } else {
	   	clearTimeout(timeoutID);
	   	clearInterval(intervalID);
	   }
	   selectCompleteBubble($lastbubble);
	   count--;
	}

	// Внутренняя функция визуализация выделения сравниваемых елементов
	function selectCompleteBubble (obj1) {
		obj1.css('backgroundColor', 'green');
	}

	// Внутренняя функция, меняющая позиции двух элементов
	function swapBubble (obj1, obj2) {
		var obj1l = obj1.width() + 5,
			 obj2l = obj2.width() + 5,
			 obj1_pos = obj1.offset(),
			 obj2_pos = obj2.offset(),
			 obj1_clone = obj1.clone(),
			 obj2_clone = obj2.clone();

		obj1.css('opacity', 0);
		obj2.css('opacity', 0);

		obj1_clone.insertAfter(obj1).css({position: "absolute", width: obj1.outerWidth(), height: obj1.outerHeight()}).offset(obj1_pos).css("z-index", "1");
		obj2_clone.insertAfter(obj2).css({position: "absolute", width: obj2.outerWidth(), height: obj2.outerHeight()}).offset(obj2_pos).css("z-index", "1");

      obj1_clone.animate({
      	left: "+=" + obj2l + "px",
      	},
      	"slow",
      	function(){
     			obj2.insertBefore(this).css("opacity", 1);
      		$(this).remove();
      });

      obj2_clone.animate({
      	left: "-=" + obj1l + "px"
      	},
      	"slow",
      	function(){
      		obj1.insertBefore(this).css("opacity", 1);
      		$(this).remove();
      });
	}
}

// Внутренняя функция очистки контейнера
bubbleSortingClass.prototype.clearWindow = function() {
	this.$conteiner1.empty();
	this.$conteiner2.empty();
};
// Метод блокировки кнопок
bubbleSortingClass.prototype.blokedButtons = function() {
	$('.generate').addClass('disabled').attr('disabled', 'disabled');
	$('.play').addClass('disabled').attr('disabled', 'disabled');
};
// Метод разблокировки кнопок
bubbleSortingClass.prototype.unblokedButtons = function() {
	$('.generate').removeClass('disabled').removeAttr('disabled');
	$('.play').removeClass('disabled').removeAttr('disabled');
};

$(document).ready(function () {
	// Создаём экземпляр класс
	var list = new bubbleSortingClass();
	// Обработчик кнопки "Генерация массива"
	$('.generate').click(function () {
		list.clearWindow();
		list.createAndShowBubble();
		$('.play').removeAttr('disabled').removeClass('disabled');
	});
	// Обработчик кнопки "Старт"
	$('.play').click(function () {
		list.bubbleSort();
		$('.play').attr('disabled', 'disabled').addClass('disabled');
	});
	// Обработчик кнопки "Инструкция"
	$('.instruction').click(function () {
		if (!$('.play').hasClass('disabled') || !$('.generate').hasClass('disabled')) {
			list.blokedButtons();
		} else {
			list.unblokedButtons();
		}
		$('.instructionText').toggle('slow');
	});
	// Закрытие окна инструкции по нажатию на это окно
	$('.instructionText').click(function () {
		$('.instructionText').toggle('slow');
		list.unblokedButtons();
	});		
});
