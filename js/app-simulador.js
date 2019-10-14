//$(document).foundation();

var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|IEMobile|WPDesktop/i.test(navigator.userAgent) ? true : false;

if (!isMobile) {
    document.body.className = 'dispositivoWeb';
} else {
    var inputs = $("select");
    var calendario = $(".datepicker");
    inputs.addClass('browser-default');
    calendario.removeClass('datepicker');
    calendario.attr('type', 'date');
};

/*if (navigator.userAgent.match(/Windows Phone|IEMobile|WPDesktop/i)) {
    document.body.className = 'windowsPhone';
    console.log('hola windows');
}

if (navigator.userAgent.match(/Android/i)) {
    document.body.className = 'android';
    console.log('hola android');
}

if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
    document.body.className = 'apple';
}*/

function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
{
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

function checkVersion() {
    var msg = "You're not using Internet Explorer.";
    var ver = getInternetExplorerVersion();
    var inputsIE = document.getElementsByTagName("input");
    for (var i = 0; i < inputsIE.length; i++) {
        if (ver >= 8.0) {
            inputsIE[i].setAttribute("placeholder", " ")
        } else {
            msg = "Esta versión de Internet Explorer es obsoleta, actualiza a la versión mas reciente";
        }
    }
}

checkVersion();

jQuery(document).ready(function ($) {
    //jQuery time
    //setTimeout(function(){ $('select').material_select(); }, 1000);
    //$(".button-collapse").sideNav();
    //$('select').material_select();
    /*$('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year
        // The title label to use for the month nav buttons
        labelMonthNext: 'Mes siguiente',
        labelMonthPrev: 'Mes anterior',

        // The title label to use for the dropdown selectors
        labelMonthSelect: 'Selecciona un mes',
        labelYearSelect: 'Selecciona un año',

        // Months and weekdays
        monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],

        // Materialize modified
        weekdaysLetter: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],

        // Today and clear
        today: 'Hoy',
        clear: 'Limpiar',
        close: 'Cerrar',
    }); */ 
    
});

$(window).load(function () {
    if ($('nav').hasClass('topbar-fixed')) {
        navFixed();
    }
    $("#triggerSide").sideNav({
        closeOnClick: true,    
    });
});

$(window).resize(function () {
    if ($('nav').hasClass('topbar-fixed')) {
        navFixed();
    }
});

/* ==============================================
TOPBAR FIXED
=============================================== */

function navFixed() {
    var heightNav = $('.topbar-fixed').outerHeight();
    $('.topbar-fixed').parent().css('height', heightNav);
    $(window).scroll(function () {
        if ($(this).scrollTop() > 1) {
            $('.topbar-fixed').addClass("stick");
        } else {
            $('.topbar-fixed').removeClass("stick");
        }
    });
}

/* ==============================================
ANCHO DINAMICO INPUT
=============================================== */

/*$(document).ready(function(){
    
    setTimeout(function(){
        $.fn.textWidth = function(text, font) {
    
            if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);

            $.fn.textWidth.fakeEl.text(text || this.val() || this.text() || this.attr('placeholder')).css('font', font || this.css('font'));

            return $.fn.textWidth.fakeEl.width();
        };

        $('.select-dropdown').on('input', function() {
            var inputWidth = $(this).textWidth();
            $(this).css({
                width: inputWidth
            })
        }).trigger('input');


        function inputWidth(elem, minW, maxW) {
            elem = $(this);
            console.log(elem + " timeout")
        }

        var targetElem = $('.select-dropdown');
        inputWidth(targetElem);
    }, 100);
    $('.select-wrapper select').change(function() {
        $.fn.textWidth = function(text, font) {
    
            if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);

            $.fn.textWidth.fakeEl.text(text || this.val() || this.text() || this.attr('placeholder')).css('font', font || this.css('font'));

            return $.fn.textWidth.fakeEl.width();
        };

        $('.select-dropdown').on('input', function() {
            var inputWidth = $(this).textWidth();
            $(this).css({
                width: inputWidth
            })
        }).trigger('input');


        function inputWidth(elem, minW, maxW) {
            elem = $(this);
            console.log(elem + " cambio el select")
        }

        var targetElem = $('.select-dropdown');
        inputWidth(targetElem);
    });
});*/

//inicializa WOW
    wow = new WOW(
      {
          boxClass:     'wow',      // default
          animateClass: 'animated', // default
          offset:       0,          // default
          mobile:       true,       // default
          live:         true        // default
        }
        )
        wow.init();

function loadnoUISlider(){
    var carruselHeader = $(".carrusel-header");

    carruselHeader.on('initialized.owl.carousel ' + 'translated.owl.carousel', function (e) {
        var owlItemActivo = $('.carrusel').find('.owl-item.active');
        var owlItem = $('.carrusel').find('.owl-item').not('.owl-item.active');
        owlItemActivo.find('.texto').addClass('animacion');
        owlItem.find('.texto').removeClass('animacion');
    });

    carruselHeader.owlCarousel({
        items: 1,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplaySpeed: 900,
        navText: ["<i class='fa fa-angle-left'>", "<i class='fa fa-angle-right'>"],
        center: false,
        responsive: {
            0: {
                items: 1,
                nav: false,
                dots: true,
                loop: true,
                stagePadding: 0,
                autoplay: true
            },
            768: {
                items: 1,
                nav: true,
                dots: true,
                loop: true,
                stagePadding: 0,
                autoplay: true
            }
        }
    });
}

function ayudaHomePrivada() {
    var flag  = true;
    if(flag){
        flag = false;

        // Instance the tour
        var tour = new Tour({
            backdrop: true,
            template: "<div class='popover tour'><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='button turquesa' data-role='prev'>Prev</button><button class='button turquesa' data-role='next'>Siguiente</button><button class='button success' data-role='end'>Fin</button></div></div>",
                steps: [
                    {
                        element: "#ayudaProgreso",
                        placement: "bottom",
                        title: "Tu préstamo",
                        content: "Aquí podrás ver cuánto has pagado, cuánto te resta y tu próximo pago, ¿podrás llegar a la meta?"
                }, {
                        element: "#ayudaMovimientos",
                        placement: "bottom",
                        title: "Movimientos recientes",
                        content: "Aquí encontrarás los últimos movimientos de tu préstamo, ya sean tus próximos pagos o los pagos realizados"
                }
            ]
        })

        // Initialize the tour
        tour.init();

        // Start the tour
        tour.restart();
    }
}
var tour;
function ayudaSubidaDocumentos() {
    var flag  = true;
    if(flag){
        flag = false;

        // Instance the tour
        tour = new Tour({
            backdrop: true,
            template: "<div class='popover tour'><h3 class='popover-title'></h3><div class='popover-content'></div></div>",
                steps: [
                    {
                        element: "",
                        placement: "left",
                        orphan: true,
                        title: "Guía de como subir tus documentos",
                        content: "Pon atención a las siguientes instrucciones, ya que deberás aplicarlas al finalizar.\<br /><br />Da clic en el botón siguiente<div class='popover-navigation'><button class='button turquesa' data-role='next'>Siguiente</button></div>"
                }, {
                        element: "#ayudaPalabra",
                        placement: "top",
                        orphan: true,
                        title: "",
                        content: "Necesitamos que nos envíes una \<span class='texto-turquesa'>selfie</span> sosteniendo un papel con la \<span class='texto-turquesa'>palabra clave</span> que te aparece en la imagen de abajo.\<br /><br />Da clic en el botón siguiente<div class='popover-navigation'><button class='button turquesa' data-role='prev'>Prev</button><button class='button turquesa' data-role='next'>Siguiente</button></div>"
                }, {
                        element: "#ayudaArrastrar",
                        placement: "top",
                        orphan: true,
                        title: "",
                        content: "También arrastra los documentos solicitados en cada uno de los espacios correspondientes.\<br /><br />Da clic en el botón siguiente<div class='popover-navigation'><button class='button turquesa' data-role='prev'>Prev</button><button class='button turquesa' data-role='next'>Siguiente</button></div>"
                }, {
                        element: "#ayudaAdjuntar",
                        placement: "top",
                        orphan: true,
                        title: "",
                        content: "O adjuntalos dando clic en el ícono que se muestra abajo.\<br /><br />Da clic en el botón siguiente<div class='popover-navigation'><button class='button turquesa' data-role='prev'>Prev</button><button class='button turquesa' data-role='next'>Siguiente</button></div>"
                }, {
                        element: "",
                        placement: "",
                        orphan: true,
                        title: "",
                        content: "Esperamos que estas instrucciones te hayan servido de ayuda.\<br /><br />Da clic en fin para terminar esta guía.<div class='popover-navigation'><button class='button turquesa' data-role='prev'>Prev</button><button class='button success' data-role='end'>Fin</button></div>"
                }
            ]
        })

        // Initialize the tour
        tour.init();

        // Start the tour
        tour.restart();
       
    }
}

function cerrarAyudaSubidaDocumentos(){
    if(tour){
        tour.end();
    }
}