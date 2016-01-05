<?php

function process_payment( $token, $yid )
{
	require_once($_SERVER['DOCUMENT_ROOT'] . "/server/payment.php");
	$strapd_payment = new Strapd_Payment();

	if( $token == 'free' ) $result = $strapd_payment->free_entry( $yid );
	else $result = $strapd_payment->pay_with_stripe( $token, $yid );

	return $result;
}

if( isset( $_REQUEST['payment_token'] ) )
{
	//echo 'Posting like a boss\n';
	$reslt = process_payment( $_REQUEST['payment_token'], $_REQUEST['yid'] );
	error_log( 'The payment result: ' . $reslt );
	echo json_encode( array( 'status' => 'Posting like a boss', 'result' => $reslt ) );
}

?>
