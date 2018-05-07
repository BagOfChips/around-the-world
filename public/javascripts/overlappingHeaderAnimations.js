
$(document).ready(function(){

    $("#instructions").delay(900).animate({
        opacity: 1
    }, 1000, function(){});

    /**
     * On `#reset` clicked,
     *  1. unset and remove markers
     *  2. fade away `this` button
     *  3. reset instructions
     */
    $("#reset").on('click', function(){
        clearAllMarkers();
        $(this).animate({opacity: 0}, 500, function(){
            $(this).hide(); // hide after fade out
        });

        instructionsTyped = new Typed('#instructions-text', {
            strings: ["", instructionSet.start],
            typeSpeed: 10,
            backSpeed: 10,
            showCursor: false
        });
    });
});