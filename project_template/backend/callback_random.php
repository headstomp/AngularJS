<?php

header('Access-Control-Allow-Origin: *');

$callback = $_GET['callback'];
$q = $_GET['q'];
header('Content-Type: ' . ($callback ? 'text/javascript' : 'text/json') . ';charset=UTF-8');

$num = rand(10,100);
$item = array('item_id' => $q);
$data = array('value' => $num);



echo ($callback ? $callback . '(' : '') . json_encode(array('item' => $item,'data' => $data)) . ($callback ? ')' : '');

?>