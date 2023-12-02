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


        $result = json_decode('{"cId":' . $cId . '}');
        $res1 = json_decode(spCallReturn($result, 1500005));
        $result1 = $res1->result;
        $it = $result1->item;
        $itData = $result1->data;
        // var_dump($result1->data);
    ?>
        <div class="container-fluid">
            <div class="container-fluid">
                <!-- Title -->
                <div class=" d-flex justify-content-between align-items-center py-3">
                    <div>
                        <h2 class="h2 mb-0 text-primary"> Aone Rental</h2>
                        <h5 class="h5 mb-0"></a>Pukkattupady</h5>
                    </div>
                    <div>
                        <h2 class="h4 mb-0 text-end"><?php echo $rs[0]["cName"]; ?></h2>
                        <div class="text-end"><span class="badge bg-danger rounded-pill ">PENDING AMOUNT</span> <b class="text-danger ms-1 h4"><?php echo "₹" . abs($itemAmount - $paid)  ?></b></div>
                    </div>
                </div>

                <!-- Main content -->
                <div class="row mt-4">
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
                                                <tr>
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
                    <div class="col-lg-4">
                        <!-- Customer Notes -->
                        <div class="card mb-4">
                            <div class="card-body">
                                <h3>Items Amount</h3>
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Item</th>
                                                <th scope="col">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            $i = 0;
                                            foreach ($items as $value) {
                                                $i++;
                                            ?>
                                                <tr>
                                                    <th scope="row"><?php echo $i; ?></th>
                                                    <td><?php echo $value->itemName; ?></td>
                                                    <td><?php echo $value->amount; ?></td>
                                                </tr>
                                            <?php } ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card mb-4">
                            <div class="card-body">
                                <h3>Extra Amount</h3>
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Amount</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">Note</th>
                                                <th scope="col">status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            $i = 0;
                                            foreach ($extraPayment as $value) {
                                                $i++;
                                            ?>
                                                <tr>
                                                    <th scope="row"><?php echo $i; ?></th>
                                                    <td><?php echo $value->amount; ?></td>
                                                    <td><?php echo $value->date; ?></td>
                                                    <td><?php echo $value->note; ?></td>
                                                    <td><?php if ($value->status == 0) { ?>
                                                            <span class="badge bg-success  rounded-pill">Discount</span>
                                                        <?php } else { ?>
                                                            <span class="badge bg-danger  rounded-pill">Add on</span>
                                                        <?php } ?>
                                                    </td>
                                                </tr>
                                            <?php } ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <!-- Customer Notes -->
                        <div class="card mb-4">
                            <div class="card-body">
                                <div class="row justify-content-between">

                                    <div class="col-6">
                                        <h3>Items</h3>
                                    </div>
                                    <div class="col-6">
                                        <select class="form-select ps-10" onchange="itemChange(this)">
                                            <option selected disabled>Open this select Item</option>
                                            <?php
                                            foreach ($it as $key => $value) {
                                                echo '<option value="' . ($key + 1) . '">' . $value->name . '</option>';
                                            }
                                            ?>

                                        </select>
                                    </div>

                                </div>

                                <div class="table-responsive">
                                    <table class="table w-100">
                                        <h4 id="itemTableFoot"></h4>
                                        <thead>
                                            <tr>
                                                <th scope="col" style="width:5%">#</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">Rented</th>
                                                <th scope="col">Returned</th>
                                            </tr>
                                        </thead>
                                        <tbody id="itemTable">

                                            <tr>

                                                <td></td>
                                                <td></td>
                                            </tr>
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
    <script>
        var data = JSON.parse('<?php echo json_encode($itData); ?>');

        function itemChange(e) {
            var outData = "";
            var index = 1;
            var total = 0;
            data.forEach((element) => {
                if (!(element[e.value].outgoing.qty == 0 && element[e.value].incoming.qty == 0)) {
                    total = total + element[e.value].outgoing.qty
                    total = total - element[e.value].incoming.qty
                    outData = outData + "<tr>"
                    outData = outData + '<th scope="row">' + index + '</th>'
                    outData = outData + "<th>" + element[0] + "</th>"
                    if (element[e.value].outgoing.qty == 0) {
                        outData = outData + "<th></th>"
                    } else {
                        outData = outData + "<th>" + element[e.value].outgoing.qty + "</th>"
                    }
                    if (element[e.value].incoming.qty == 0) {
                        outData = outData + "<th></th>"
                    } else {
                        outData = outData + "<th>" + element[e.value].incoming.qty + "</th >"
                    }
                    outData = outData + "</tr>"
                    index++
                }
            });
            document.getElementById("itemTable").innerHTML = outData
            document.getElementById("itemTableFoot").innerHTML = "<b>Pending : " + total + "</b>"
        }
    </script>
</body>

</html>