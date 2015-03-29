<?php get_header(); ?>	
<div id="content">
	<div class="container">
	
		<div id="single_cont">
		
			<div class="single_left">
			
				<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
			
					
					
					<div class="single_inside_content">
					
						<?php the_content(); ?>
						
					</div><!--//single_inside_content-->
					
					<br /><br />
					
					<?php //comments_template(); ?>							
				
				<?php endwhile; else: ?>
				
					<h3>Sorry, no posts matched your criteria.</h3>
				<?php endif; ?>                    																
			
			</div><!--//single_left-->
			
			
			
			<div class="clear"></div>
		
		</div><!--//single_cont-->
		
	</div><!--//container-->
</div><!--//content-->
<?php get_footer(); ?> 		