<?php
/*
	Template Name: Blog
*/
?>
<?php get_header(); ?>	
<div id="content">
	<div class="container">
	
		<div class="single_full_cont">
		
			<div id="posts_cont">
		
				<?php
				$args = array(
					 'category_name' => 'blog',
					 'post_type' => 'post',
					 'posts_per_page' => 4,
					 'paged' => ( get_query_var('paged') ? get_query_var('paged') : 1)
					 );
				query_posts($args);
				$x = 0;
				while (have_posts()) : the_post(); ?>                                            		
					<div class="blog_box">
						<div class="left">
							<p class="blog_date"><?php the_time('F d, Y'); ?></p>
							<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
						</div> <!-- //left -->
						<div class="right">
							<?php if(get_post_meta( get_the_ID(), 'page_featured_type', true ) == 'youtube') { ?>
								<iframe width="560" height="315" src="http://www.youtube.com/embed/<?php echo get_post_meta( get_the_ID(), 'page_video_id', true ); ?>" frameborder="0" allowfullscreen></iframe>
							<?php } elseif(get_post_meta( get_the_ID(), 'page_featured_type', true ) == 'vimeo') { ?>
								<iframe src="http://player.vimeo.com/video/<?php echo get_post_meta( get_the_ID(), 'page_video_id', true ); ?>?title=0&amp;byline=0&amp;portrait=0&amp;color=03b3fc" width="500" height="338" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
							<?php } else { ?>
								<a href="<?php the_permalink(); ?>"><?php the_post_thumbnail('ut-blog-image'); ?></a>
							<?php } ?>												
							<p><?php echo ds_get_excerpt('350'); ?></p>
							<div class="clear"></div>
						</div> <!-- //right -->
						<div class="clear"></div>
					</div> <!-- //blog_box -->
									
					
				<?php $x++; ?>
				<?php endwhile; ?>
				
				<div class="clear"></div>			
				
			</div><!--//posts_cont-->
			
			<div class="load_more_cont">
				<div align="center"><div class="load_more_text">
				<?php
				ob_start();
				next_posts_link('<img src="' . get_bloginfo('stylesheet_directory') . '/images/loading-button.png" />');
				$buffer = ob_get_contents();
				ob_end_clean();
				if(!empty($buffer)) echo $buffer;
				?>
				</div></div>
			</div><!--//load_more_cont-->     					
			
			<?php wp_reset_query(); ?>                        
		
		</div><!--//single_full_cont-->
		
		<?php //get_sidebar(); ?>
		
		<div class="clear"></div>	
		
		
	</div><!--//container-->
</div><!--//content-->
<script type="text/javascript">
$(document).ready(
function($){
  $('#posts_cont').infinitescroll({
 
    navSelector  : "div.load_more_text",            
		   // selector for the paged navigation (it will be hidden)
    nextSelector : "div.load_more_text a:first",    
		   // selector for the NEXT link (to page 2)
    itemSelector : "#posts_cont .blog_box"
		   // selector for all items you'll retrieve
  },function(arrayOfNewElems){
  
  $('#posts_cont').append('<div class="clear"></div>');
  
      //$('.home_post_cont img').hover_caption();
 
     // optional callback when new content is successfully loaded in.
 
     // keyword `this` will refer to the new DOM content that was just added.
     // as of 1.5, `this` matches the element you called the plugin on (e.g. #content)
     //                   all the new elements that were found are passed in as an array
 
  });  
}  
);
</script>	
<?php get_footer(); ?> 		