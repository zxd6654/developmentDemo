<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>无标题文档</title>
</head>

<body>
<?php

$a1=array(1,2,3,5);
$a2=array(7,8,9);
print_r(array_splice($a1,0,3,$a2));
print_r($a1);
?>
<script>

var arr=[1,2,3,4,5];
var arr1=arr.splice(0,2,[7,8,9]);
alert(JSON.stringify(arr));

</script>
</body>
</html>