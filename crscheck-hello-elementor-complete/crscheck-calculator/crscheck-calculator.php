<?php
/**
 * Plugin Name: CRSCheck Native Calculator
 * Description: Inline CRS calculator shortcode and native Elementor widget; no iframe.
 * Version: 2.0.0-beta
 * Requires PHP: 7.4
 * Text Domain: crscheck-calculator
 */
if (!defined('ABSPATH')) exit;
function crscheck_native_assets(){
 wp_register_style('crscheck-native-calculator',plugins_url('assets/calculator.css',__FILE__),[], '2.0.0');
 wp_register_script('crscheck-native-calculator',plugins_url('assets/calculator.js',__FILE__),[], '2.0.0',true);
}
add_action('wp_enqueue_scripts','crscheck_native_assets');
function crscheck_native_shortcode($atts=[]){
 wp_enqueue_style('crscheck-native-calculator');wp_enqueue_script('crscheck-native-calculator');
 ob_start(); echo '<div class="crscheck-calculator-instance" aria-label="Canada CRS calculator">';
 include __DIR__.'/assets/calculator-markup.php';echo '</div>';
 return ob_get_clean();
}
add_shortcode('crscheck_calculator','crscheck_native_shortcode');
add_action('elementor/widgets/register',function($manager){
 if (!class_exists('\Elementor\Widget_Base'))return;
 class CRSCheck_Native_Elementor_Widget extends \Elementor\Widget_Base {
  public function get_name(){return 'crscheck_calculator';}
  public function get_title(){return 'CRSCheck Calculator (Native)';}
  public function get_icon(){return 'eicon-calculator';}
  public function get_categories(){return ['general'];}
  public function get_keywords(){return ['crs','canada','calculator','express entry'];}
  protected function register_controls(){
   $this->start_controls_section('intro',['label'=>'Calculator']);
   $this->add_control('notice',['type'=>\Elementor\Controls_Manager::RAW_HTML,'raw'=>'Full inline calculator. Change design with your Hello child theme CSS. No iframe is used.']);
   $this->end_controls_section();
  }
  protected function render(){echo crscheck_native_shortcode();}
 }
 $manager->register(new CRSCheck_Native_Elementor_Widget());
});
