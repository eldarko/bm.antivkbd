// ==UserScript==
// @name         MoscowBank AntiVirtualKeyboard
// @namespace    eldarko
// @description  Скрипт позволяет обойти виртуальную клавиатуру при входе в веб-банкинг Банка Москвы.
// @include      https://ibank.mmbank.ru/scoring/login.jsf*
// @include      https://ibank.mmbank.ru/scoring/j_security_check*
// ==/UserScript==

var passwordField = document.getElementById("j_password");
var fakePassword  = document.getElementById('fake_password');

if( !passwordField )
	return;

// See: https://ibank.mmbank.ru/scoring/img_2/keyboard/keyboard_image_pressed.png
var keyboard = 'qQwWeErRtTyYuUiIoOpPaAsSdDfFgGhHjJkKlLzZxXcCvVbBnNmM' 
	+ '.,/@()-_;:[]`\'"#$%&!?*+={}<>~№'
	+ '1234567890'
	+ 'йЙцЦуУкКеЕнНгГшШщЩзЗхХъЪфФыЫвВаАпПрРоОлЛдДжЖэЭяЯчЧсСмМиИтТьЬбБюЮ'
	;

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

function fill_password()
{
	var pass = fakePassword.value;
	if(pass.match(/^\*+$/g) != null) 
		return; // it was virtual keyboard input. password already filled.

	passwordField.value = '';
	for(var i = 0; i < pass.length; i++)
	{
		var c = pass[i];
		passwordField.value += keyboard_replace[c] + '_';
	}
}

fakePassword.removeAttribute('readonly');

var default_handler = unsafeWindow.doOnSubmit;

unsafeWindow.doOnSubmit = function(){
	fill_password();
	default_handler();
}

// Блок Google Analytics. Позволяет понять, сколько людей вообще пользуются скриптом.
// При желании, его можно удалить, но я был бы благодарен, если вы его оставите.
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-21768398-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
