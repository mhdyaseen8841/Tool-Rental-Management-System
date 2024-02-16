<?php
include '../config/config.php';
include '../API/spcall/spcall.php';
$cId = 0;
$db = new Database();
if (isset($_REQUEST["cId"])) {
    $cId = $_GET["cId"];
}


?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User details</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
    <style>
        body {
            background: #eee;
        }

        .card {
            box-shadow: 0 20px 27px 0 rgb(0 0 0 / 5%);
        }

        .card {
            position: relative;
            display: flex;
            flex-direction: column;
            min-width: 0;
            word-wrap: break-word;
            background-color: #fff;
            background-clip: border-box;
            border: 0 solid rgba(0, 0, 0, .125);
            border-radius: 1rem;
        }

        .text-reset {
            --bs-text-opacity: 1;
            color: inherit !important;
        }

        a {
            color: #5465ff;
            text-decoration: none;
        }

        .table-responsive {
            height: 180px;
        }
    </style>
</head>

<body>
    <?php if (isset($_REQUEST["cId"])) {

        $rs =  $db->select("select cName from customermaster where cId = $cId");
        $result = json_decode('{"cId":' . $cId . '}');
        $res = json_decode(spCallReturn($result, 1700005));

        $items = $res->result[0];
        if ($items[0] == null) {
            $items = [];
        }

        $payment = $res->result[1];
        if ($payment[0] == null) {
            $payment = [];
        }

        $extraPayment = $res->result[2];
        if ($extraPayment[0] == null) {
            $extraPayment = [];
        }
        $item = $res->items;


        $itemAmount = $item->items;

        $paid = $item->paid;
        $res1 = json_decode(spCallReturn($result, 1500005));
        $result1 = $res1->result;
        $it = $result1->item;
        $itData = $result1->data;

        $res2 = json_decode(spCallReturn($result, 1600006));
        $result2 = $res2->data;
    ?>
        <div class="container-fluid">
            <div class="container-fluid">
                <!-- Title -->
                <div class="row justify-content-between pt-2 pb-1">
                    <div class="col-xs-2 col-sm-4">
                        <div class="row justify-content-between">
                            <div class="col-6 col-sm-12">
                                <div class="h3 mb-0 text-primary text-start"> Aone Rental</div>
                            </div>
                            <div class="col-6 col-sm-12">
                                <div class="h3 mb-0 text-end"></a>Pukkattupady</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-6 col-sm-4 col-lg-3 mt-2 mt-md-0 px-2">
                        <h2 class="h4 mb-0 text-secondary text-center text-md-end"><?php echo $rs[0]["cName"]; ?></h2>
                        <div class="row">
                            <div class="col-xs-8 col-sm-6">
                                <div class="vstack text-end">
                                    <span class="badge bg-danger rounded-pill Display 6">PENDING AMOUNT</span>
                                    <b class="text-danger text-center h3"><?php echo "₹" . number_format((float)abs($itemAmount - $paid), 2, '.', '');  ?></b>
                                </div>
                            </div>
                            <div class="col-xs-8 col-sm-6">
                                <div class="vstack text-end">
                                    <span class="badge bg-primary rounded-pill Display 6">DAILY AMOUNT</span>
                                    <b class="text-primary text-center h3"><?php echo "₹" . number_format((float)$result2, 2, '.', ''); ?></b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main content -->
                <div class="row mt-4">
                    <div class="col-12">
                        <!-- Customer Notes -->
                        <div class="card mb-4">
                            <div class="card-body">
                                <div class="row justify-content-between">

                                    <div class="col-6">
                                        <h3>Items</h3>
                                    </div>
                                    <div class="table-responsive" style="height: 370px;">
                                        <table class="table w-100">
                                            <h4 id="itemTableFoot"></h4>
                                            <thead>
                                                <tr style="background : white; position: sticky; top: 0;z-index:99;">
                                                    <th scope="col"> </th>
                                                    <?php
                                                    foreach ($it as $key => $value) { ?>
                                                        <th style="text-align: center" scope="col"><?php echo  $value->name; ?></th>
                                                    <?php
                                                    }
                                                    ?>
                                                </tr>
                                            </thead>
                                            <tbody id="itemTable">
                                                <?php
                                                $totals = array();
                                                foreach ($itData as $key => $value) {
                                                    echo "<tr>";
                                                    foreach ($value as $key1 => $value1) {
                                                        if ($key1 == 0) {
                                                            echo "<td style='background : white; left : 0; position : sticky; z-index:98;' align ='left' nowrap='nowrap'>" . $value1 . "</td>";
                                                        } else {
                                                            $income = $value1->incoming;
                                                            $outgo = $value1->outgoing;
                                                            $totals[$key1] = $totals[$key1] + ($outgo->qty - $income->qty);
                                                            echo "<td align='center'>";
                                                            if ($income->qty != 0) {
                                                                echo "<div style='background:green;width:50px;color:white;font-weight:bold;'>" . $income->qty . "</div>";
                                                            }
                                                            if ($outgo->qty != 0) {
                                                                echo "<div style='background:red;width:50px;color:white;font-weight:bold;'>" . $outgo->qty . "</div>";
                                                            }
                                                            echo "</td>";
                                                        }
                                                    }
                                                    echo "</tr>";
                                                } ?>
                                            </tbody>
                                            <tfoot>
                                                <?php
                                                echo "<tr style='background : white; position: sticky; bottom: 0;z-index:99;'> <td style='background : white; left : 0; position : sticky; z-index:98;' align ='left' nowrap='nowrap'>pending</td>";
                                                foreach ($totals as $key => $value) {
                                                    echo "<td align='center'><div style='width:50px;font-weight:bold;'>" . $value . "</div></td>";
                                                }
                                                echo "</tr>";
                                                ?>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <!-- Details -->

                        <!-- Payment -->
                        <div class="card mb-4">
                            <div class="card-body">
                                <div class="row">
                                    <h3>Payments</h3>
                                    <div class="table-responsive">
                                        <table class="table">
                                            <thead>
                                                <tr style="background : white; position: sticky; top: 0;">
                                                    <th scope="col">#</th>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php
                                                $i = 0;
                                                foreach ($payment as $value) {
                                                    $i++;
                                                ?>
                                                    <tr>
                                                        <th scope="row"><?php echo $i; ?></th>
                                                        <td><?php echo $value->date; ?></td>
                                                        <td><?php echo $value->amount; ?></td>
                                                    </tr>
                                                <?php } ?>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <?php } else { ?>
            <H2 style="color: red;">
                <marquee>No User Selected</marquee>
            </H2>
        <?php } ?>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>