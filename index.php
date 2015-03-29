<?php get_header(); ?>	
<?php $shortname = "unit_theme"; ?>
<div id="slideshow_cont">
	<div class="flicker-example fullplate" data-block-text="false">
		<div class="scroller">
			<!--<div class="icon-arrow-down2 scroller-icon"></div>
			SCROLL<span>DOWN</span>-->
			SCROLL &#9660;  DOWN 
		</div>		
		<ul>			
			<?php
			$slider_arr = array();
			$x = 0;
			$args = array(
				 //'category_name' => 'blog',
				 'post_type' => 'post',
				 'meta_key' => 'ex_show_in_slideshow',
				 'meta_value' => 'Yes',
				 'posts_per_page' => 99
				 );
			query_posts($args);
			while (have_posts()) : the_post(); 
				$thumb = wp_get_attachment_image_src( get_post_thumbnail_id(get_the_ID()), 'full' );
				//$thumb = wp_get_attachment_image_src( get_post_thumbnail_id(get_the_ID()), 'large' );
				$img_url = $thumb['0']; 
			?>		
				<li data-background="<?php echo $img_url; ?>" onclick="location.href='<?php the_permalink(); ?>';" style="cursor:pointer;">
					
				</li>		
			<?php array_push($slider_arr,get_the_ID()); ?>
			<?php $x++; ?>
			<?php endwhile; ?>
			<?php wp_reset_query(); ?>                                    		
	
		</ul>
		
	</div>
</div> <!-- //slideshow_cont -->




<div id="content">
	<div class="container">
		<?php
		$category_ID = get_category_id('blog');
		$args = array(
			 'post_type' => 'post',
			 'posts_per_page' => 6,
			 'post__not_in' => $slider_arr,
			 'cat' => '-' . $category_ID
			 );
		query_posts($args);
		$x = 0;
		while (have_posts()) : the_post(); ?>                        					
			<div class="home_box">
				<div class="home_box_media">
					<?php if(get_post_meta( get_the_ID(), 'page_featured_type', true ) == 'youtube') { ?>
						<iframe width="560" height="315" src="http://www.youtube.com/embed/<?php echo get_post_meta( get_the_ID(), 'page_video_id', true ); ?>" frameborder="0" allowfullscreen></iframe>
					<?php } elseif(get_post_meta( get_the_ID(), 'page_featured_type', true ) == 'vimeo') { ?>
						<iframe src="http://player.vimeo.com/video/<?php echo get_post_meta( get_the_ID(), 'page_video_id', true ); ?>?title=0&amp;byline=0&amp;portrait=0&amp;color=03b3fc" width="500" height="338" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
					<?php } else { ?>
						<a href="<?php the_permalink(); ?>"><?php the_post_thumbnail('ut-home-image'); ?></a>
						
						
						<a class="home_box_hover" href="<?php the_permalink(); ?>">
							<div class="home_box_row">
								<div class="home_box_cell">
									<?php echo ds_get_excerpt('200'); ?>
								</div> <!-- //home_box_cell -->
							</div> <!-- //home_box_row -->
						</a> <!-- //home_box_hover -->
						
					<?php } ?>			
				</div> <!-- //home_box_media -->	
				
										
				<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
				  <p class="cat"><?php the_category(' / '); ?></p>
				
			</div> <!-- //home_box -->		
			<?php if($x == 1) { echo '<div class="clear"></div>'; $x = -1; } ?>
		<?php $x++; ?>
		<?php endwhile; ?>
		<?php wp_reset_query(); ?>
		<div class="clear"></div>
		
		
	</div> <!-- //container -->
</div> <!-- //content -->
<?php get_footer(); ?> 		