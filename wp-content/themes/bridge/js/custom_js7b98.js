/*jslint browser: true*/
/*global $, jQuery*/

var $j = jQuery.noConflict();

$j(document).ready(function () {
	"use strict";

	$j(document).ready(function () {
        $j(".norm_container_inner").addClass("visible");
        $j(window).scroll(function () {
            $j(".q_logo").addClass("hidden");
        });


        $j(".buttonport").click(function () {
            if ($j("#info").is(":hidden")) {
                $j("#info").show(500, "easeInQuart");
            } else {
                if ($j("#info").is(":visible")) {
                    $j("#info").hide(500, "easeInQuart");
                }
            }
        });

        $j(".buttonport").click(function () {
            if ($j(".aboutme").is(":hidden")) {
                $j(".aboutme").show(500, "easeInQuart");
            //$j("#resume").show(500, "easeInQuart");
            } else {
                if ($j(".aboutme").is(":visible") && $j(".resume").is(":visible")) {
                    $j(".aboutme").hide(500, "easeInQuart");
                } else{
        if ($j(".aboutme" ).is(":visible")  && $j(".resume").is( ":hidden" ) ) {
         $j(".aboutme").hide(500, "easeInQuart");
        //$j("#resume").hide(500, "easeInQuart")
        }

        }
         }  
        });

$j("#resume").click(function(){
if ( $j( ".resume" ).is( ":hidden" ) ) {
   $j(".resume").show(500, "easeInQuart");
$j(".aboutme").hide(500, "easeInQuart");
} else {
if ( $j( ".resume" ).is( ":visible" ) ) {
 $j(".resume").hide(500, "easeInQuart");
$j(".aboutme").show(500, "easeInQuart");
}
 }
});


      $j("#contact").click(function () {  //custom extra
            if ($j("#contactinfo").is(":hidden")) {
                $j("#contactinfo").show(500, "easeInQuart");
            } else {
                if ($j("#contactinfo").is(":visible")) {
                    $j("#contactinfo").hide(500, "easeInQuart");
                }
            }
           //custom extra
        });
   
        $j("#shop").click(function () {
            if ($j("#shopinfo").is(":hidden")) {
                $j("#shopinfo").show(500, "easeInQuart");
            } else {
                if ($j("#shopinfo").is(":visible")) {
                    $j("#shopinfo").hide(500, "easeInQuart");
                }
            }
            
            $j("#retailers").click(function () {
            if ($j("#retailerinfo").is(":hidden")) {
                $j("#retailerinfo").show(500, "easeInQuart");
            } else {
                if ($j("#retailerinfo").is(":visible")) {
                    $j("#retailerinfo").hide(500, "easeInQuart");
                }
            }
        });
    });
});
