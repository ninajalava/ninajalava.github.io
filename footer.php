<?php $shortname = "unit_theme"; ?>
<?php //if (!is_home() && !is_front_page() && !is_archive()) { ?>
<div class="footer_copyright_cont">
<div class="footer_copyright">
	<div class="container">
		<div class="footer_social">
			<?php if(get_option($shortname.'_twitter_link','') != '') { ?>
				<a href="<?php echo get_option($shortname.'_twitter_link',''); ?>"target="_blank"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/twitter-icon.png" alt="twitter" /></a>
			<?php } ?>
			<?php if(get_option($shortname.'_facebook_link','') != '') { ?>
				<a href="<?php echo get_option($shortname.'_facebook_link',''); ?>"target="_blank"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/facebook-icon.png" alt="facebook" /></a>
			<?php } ?>
			<?php if(get_option($shortname.'_google_plus_link','') != '') { ?>
				<a href="<?php echo get_option($shortname.'_google_plus_link',''); ?>"target="_blank"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/google-plus-icon.png" alt="google plus" /></a>
			<?php } ?>
			<?php if(get_option($shortname.'_picasa_link','') != '') { ?>
				<a href="<?php echo get_option($shortname.'_picasa_link',''); ?>"target="_blank"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/picasa-icon.png" alt="picasa" /></a>
			<?php } ?>
			<?php if(get_option($shortname.'_pinterest_link','') != '') { ?>
				<a href="<?php echo get_option($shortname.'_pinterest_link',''); ?>"target="_blank"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/pinterest-icon.png" alt="pinterest" /></a>
			<?php } ?>
			<?php if(get_option($shortname.'_vimeo_link','') != '') { ?>
				<a href="<?php echo get_option($shortname.'_vimeo_link',''); ?>"target="_blank"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/vimeo-icon.png" alt="vimeo" /></a>
			<?php } ?>
			<?php if(get_option($shortname.'_youtube_link','') != '') { ?>
				<a href="<?php echo get_option($shortname.'_youtube_link',''); ?>"target="_blank"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/youtube-icon.png" alt="youtube" /></a>
			<?php } ?>
			<?php if(get_option($shortname.'_flickr_link','') != '') { ?>
				<a href="<?php echo get_option($shortname.'_flickr_link',''); ?>"target="_blank"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/flickr-icon.png" alt="youtube" /></a>
			<?php } ?>				
			<div class="clear"></div>
		</div><!--//footer_social-->
		
		<footer>
	© 2014 Creative Portfolio Theme. Developed by <a href="http://dessign.net">Dessign.net</a></div>
	</footer>
	
		
					
		
		<div class="clear"></div>
	</div><!--//container-->
</div><!--//footer_copyright-->
</div><!--//footer_copyright_cont-->
<?php //} ?>
<?php wp_footer(); ?>
</body>
</html>