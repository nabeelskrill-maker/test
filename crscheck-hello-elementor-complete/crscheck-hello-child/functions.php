<?php
if (!defined('ABSPATH')) exit;
add_action('wp_enqueue_scripts',function(){
 wp_enqueue_style('hello-elementor-parent',get_template_directory_uri().'/style.css',[],wp_get_theme('hello-elementor')->get('Version'));
 wp_enqueue_style('crscheck-hello-child',get_stylesheet_uri(),['hello-elementor-parent'],wp_get_theme()->get('Version'));
},20);
add_action('after_setup_theme',function(){register_nav_menus(['crscheck-primary'=>'CRSCheck Primary Menu']);});
function crscheck_child_menu(){
 if(has_nav_menu('crscheck-primary')){wp_nav_menu(['theme_location'=>'crscheck-primary','container'=>false,'menu_class'=>'crscheck-menu','fallback_cb'=>false]);return;}
 foreach(['Home'=>home_url('/'),'CRS Guide'=>home_url('/crs-score-guide/'),'Improve Score'=>home_url('/improve-crs-score/'),'IELTS to CLB'=>home_url('/ielts-to-clb/'),'Blog'=>home_url('/blog/')] as $label=>$url){echo '<a href="'.esc_url($url).'">'.esc_html($label).'</a>';}
}
