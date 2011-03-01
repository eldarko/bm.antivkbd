// ==UserScript==
// @name         MoscowBank AntiVirtualKeyboard
// @namespace    eldarko
// @description  Скрипт позволяет избавится от идиотской виртуальной клавиатуры при входе в веб-банкинг Банка Москвы
// @include      https://ibank.mmbank.ru/scoring/login.jsf*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// ==/UserScript==

var passwordField = document.getElementById("j_password");

if( !passwordField )
	return;

// See: https://ibank.mmbank.ru/scoring/img_2/keyboard/keyboard_image_pressed.png
var keyboard = 'qQwWeErRtTyYuUiIoOpPaAsSdDfFgGhHjJkKlLzZxXcCvVbBnNmM' 
	+ '.,/@()-_;:[]`\'"#$%&!?*+={}<>~№'
	+ '1234567890'
	+ 'йЙцЦуУкКеЕнНгГшШщЩзЗхХъЪфФыЫвВаАпПрРоОлЛдДжЖэЭяЯчЧсСмМиИтТьЬбБюЮ'
	;

var input_proto = '<input type="password" id="eldarko_password_input" style="border: 2px solid red; background-color: #FAFAFA; padding: 2px" />';

$('body').append(
	'<div style="position:absolute; top: 20px; left: 20px; width: 500px; text-align: left; background-color: white; border: 1px solid black; padding: 5px; ">' + 
		'Вместо ввода постоянного пароля через виртуальную клавиатуру его можно ввести через <b>это поле</b>: <br /><br />' +
		'<center>' + input_proto + ' <a id="eldarko_show_password" href="javascript:return false">Показать пароль</a></center>' +
	'</div>'
);

$('#eldarko_show_password').click(function(){
	var pass = $('#eldarko_password_input').val();
	$('#eldarko_password_input').replaceWith( input_proto.replace('type="password"', 'type="text"') );
	$('#eldarko_password_input').val(pass);
	$('#eldarko_show_password').hide();
});

$('#loginButton').each(function(){

	var keyboard_replace = new Array();
	var numbers = unsafeWindow.numbers;
	var tokens  = new Array().concat(
		unsafeWindow.specialCharsArray,
		unsafeWindow.enLettersArray,
		unsafeWindow.enLettersUpArray,
		unsafeWindow.ruLettersArray,
		unsafeWindow.ruLettersUpArray,
		unsafeWindow.digitsArray
	);
	for(var i = 0; i < tokens.length; i++)
	{	
		var token = tokens[i];
		var idx   = numbers[token];
		var ch    = keyboard[idx];
		keyboard_replace[ch] = token;
	}

	// TODO: put asserts here
//	alert( keyboard_replace['6'] == unsafeWindow.digitsArray[5] );

	var submitHandler = this.getAttribute("onclick");
	$(this).click(function(){
		var pass = $('#eldarko_password_input').val();
		if(pass)
		{
			var passwordField     = document.getElementById("j_password");
			var fakePasswordField = document.getElementById("fake_password");
			for(var i = 0; i < pass.length; i++)
			{
				var c = pass[i];
				passwordField.value += keyboard_replace[c] + '_';
				fakePasswordField.value += '*';
			}
		}
		eval('unsafeWindow.' + submitHandler);
	})
})
