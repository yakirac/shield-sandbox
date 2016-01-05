<?php

class Shield_Payment{

    function pay_with_stripe( $token, $yid )
    {
        require_once('server/stripe-php-2.1.4/init.php');

        error_log( 'Stripe Payment: the token - ' . $token );

        /*\Stripe\Stripe::setApiKey("sk_test_JZCGsgBlx4KjkDW0qP29pW3X");*/
        \Stripe\Stripe::setApiKey("sk_live_MlecaOsmbaq623HauXj095dl");

        $response = \Stripe\Charge::create(array(
          "amount" => 200,
          "currency" => "usd",
          "source" => $token, // obtained with Stripe.js
          "description" => "Charge For Test Payment"
        ));

        if( $response->status == 'succeeded' )
        {

        }

        //var_dump( $response->__toArray(true) );

        return $response->__toArray(true);//( array ) $response;
    }

    function free_entry( $yid )
    {
        return json_encode( array( 'status' => 'success', 'message' => 'No Payment necessary' ) );
    }



}


?>
