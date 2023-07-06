-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 25, 2023 at 06:19 AM
-- Server version: 10.5.19-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `toolsdb`
--

DELIMITER $$
--
-- Procedures
--
CREATE PROCEDURE `1000001` (IN `request` JSON)   BEGIN
	declare sts int;
    set sts = (select count(uId) from users where username = json_value(request,"$.username"));
    if sts = 0 then
		insert into users(userName,password,userType,status) values(json_value(request,"$.username"),MD5(json_value(request,"$.password")),json_value(request,"$.usertype"),1);
		select JSON_OBJECT("errorCode",1,"result","Add successfully") as result;
    else
		select JSON_OBJECT("errorCode",0,"result","username already occure") as result;
	end if;
END$$

CREATE PROCEDURE `1000002` (IN `request` JSON)   BEGIN
	update users set userType = json_value(request,"$.userType") where uId=json_value(request,"$.uId");
    select JSON_OBJECT("errorCode",1,"result","updated successfully") as result;
END$$

CREATE PROCEDURE `1000003` (IN `request` JSON)   BEGIN
	update users set status = 0 where uId=json_value(request,"$.uId");
    select JSON_OBJECT("errorCode",1,"result","updated successfully") as result;
END$$

CREATE PROCEDURE `1000005` (IN `request` JSON)   BEGIN
	select json_object("errorCode",1,"result",json_array(group_concat(json_object(
		'uId',uId,
        'username',userName,
        'userType',userType
    )))) as result from users where status =1;
END$$

CREATE PROCEDURE `1100001` (IN `request` JSON)   BEGIN
    DECLARE nam varchar(30);
    DECLARE mob varchar(20);
    DECLARE plac text;
    DECLARE num varchar(20);
    DECLARE exeName varchar(100);
    DECLARE alterNum varchar(20);
    DECLARE docs JSON;
    DECLARE dat JSON;
    DECLARE cnt int;
    DECLARE i int;
    DECLARE cid int;
    
    SET nam = json_value(request, '$.name');
    SET mob = json_value(request, '$.mobile');
    SET plac = json_value(request, '$.address');
    SET alterNum = json_value(request, '$.altermobile');
    set docs = json_extract(request,'$.documents');
    set num = (select mobile from customermaster where mobile = mob);
    set exeName = (select cName from customermaster where cName = nam);
    IF exeName IS NOT NULL THEN
        SELECT JSON_OBJECT('errorCode',0,'errorMsg','Name Already Exist!') as result;
    ELSEIF num IS NOT NULL THEN
        SELECT JSON_OBJECT('errorCode',0,'errorMsg','Mobile number already registered') as result;
    ELSE
        INSERT INTO customermaster(cName,mobile,alterMobile,address,proof,coName,coMobile) VALUES(nam,mob,alterNum,plac,json_value(request,'$.proof'),json_value(request,'$.coName'),json_value(request,'$.coMobile'));
     set cid = LAST_INSERT_ID();
     set cnt = json_length(docs) - 1;
        set i = 0;
        cmpinsert:  LOOP
			IF  i > cnt THEN
				LEAVE  cmpinsert;
			END IF;
            set dat = json_extract(docs,concat('$[',i,']'));
            insert into document(cId,docData) values(cid,json_value(dat,'$.doc'));
            set i = i+1;
        end loop;
        SELECT JSON_OBJECT('errorCode',1,'errorMsg','Inserted Successful','result',JSON_OBJECT('name',nam,'mobile',mob,'address',plac)) as result;
    END IF;
END$$

CREATE PROCEDURE `1100002` (IN `request` JSON)   BEGIN
    DECLARE nam varchar(30);
    DECLARE mob varchar(20);
    DECLARE plac text;
	DECLARE num varchar(20);
    DECLARE alterNum varchar(20);
    SET nam = json_value(request, '$.name');
    SET mob = json_value(request, '$.mobile');
    SET plac = json_value(request, '$.address');
    SET alterNum = json_value(request, '$.altermobile');
    set num = (select mobile from customermaster where mobile = mob && cId != json_value(request,'$.cId'));
    IF num IS NOT NULL THEN
     SELECT JSON_OBJECT('errorCode',0,'errorMsg','Mobile number already registered') as result;
    ELSE
      UPDATE customermaster 
      SET cName = nam,
      mobile = mob,
      alterMobile=alterNum,
      address=plac,
      proof = json_value(request,'$.proof'),
      coName = json_value(request,'$.coName'),
      coMobile = json_value(request,'$.coMobile')
      where cId= json_value(request,'$.cId');
      SELECT JSON_OBJECT('errorCode',1,'errorMsg','Update Successful','result',JSON_OBJECT(
                               'name',nam,
                               'mobile',mob,
                                'address',plac)) as result;
    END IF;
END$$

CREATE PROCEDURE `1100003` (IN `request` JSON)   BEGIN
	DECLARE num int;
    set num = (select cId from customermaster where cId = json_value(request,'$.cId'));
    IF num IS NULL THEN
     SELECT JSON_OBJECT('errorCode',0,'errorMsg','User Not Found') as result;
    ELSE
      DELETE FROM renthistorymaster WHERE cId = json_value(request,'$.cId');
      DELETE FROM paymentcollection WHERE cId = json_value(request,'$.cId');
      DELETE FROM ratecard WHERE cId = json_value(request,'$.cId');
      UPDATE customermaster set status = 1
      where cId= json_value(request,'$.cId');
      SELECT JSON_OBJECT('errorCode',1,'errorMsg','Delete Successful') as result;
    END IF;
END$$

CREATE PROCEDURE `1100004` (IN `request` JSON)   BEGIN
	DECLARE num int;
    set num = (select cId from customermaster where cId = json_value(request,'$.cId'));
    IF num IS NULL THEN
     SELECT JSON_OBJECT('errorCode',0,'errorMsg','User Not Found') as result;
    ELSE
      update customermaster set status = 0 where cId = num ;
      SELECT JSON_OBJECT('errorCode',1,'errorMsg','Activated successfully') as result;
    END IF;
END$$

CREATE PROCEDURE `1100005` (IN `request` JSON)   BEGIN
	SELECT JSON_OBJECT('errorCode',1,'result',JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT(
                               'cId',cId,
                               'cName',cName,
                               'mobile',mobile,
                               'altermobile',altermobile,
                               'address',address,
                               'proof',proof
                               )))) as result from customermaster WHERE status = 0;

END$$

CREATE PROCEDURE `1100006` (IN `request` JSON)   BEGIN
	SELECT JSON_OBJECT('errorCode',1,'result',JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT(
                               'cId',cId,
                               'cName',cName,
                               'mobile',mobile,
                               'altermobile',altermobile,
                               'address',address,
                               'proof',proof
                               )))) as result from customermaster WHERE status=1;

END$$

CREATE PROCEDURE `1100007` (IN `request` JSON)   BEGIN
update customermaster set status = 0 where cId = json_value(request,'$.cId');
select JSON_OBJECT("errorCode",1,"errorMsg","Customer Activated");
END$$

CREATE PROCEDURE `1100008` (IN `request` JSON)   BEGIN
	SELECT JSON_OBJECT('errorCode',1,'result',JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT(
                               'docData',docData,
        					   'dId',dId
                               )))) as result from customermaster WHERE cId = JSON_VALUE(request,'$.cId');

END$$

CREATE PROCEDURE `1200001` (IN `request` JSON)   BEGIN
    DECLARE nam varchar(50);
    DECLARE mont decimal(10,2);
	  DECLARE stck int;
    DECLARE num varchar(50);
    SET nam = json_value(request, '$.itemName');
    SET mont = json_value(request, '$.monthly');
    SET stck = json_value(request, '$.stock');
    set num = (select iName from items where iName = nam);
    IF num IS NOT NULL THEN
	  SELECT JSON_OBJECT('errorCode',0,'errorMsg','item already exist') as result;
    ELSE
      INSERT INTO items(iName,mRent,tStock,status) VALUES(nam,mont,stck,0);
      SELECT JSON_OBJECT('errorCode',1,'errorMsg','Inserted Successful','result',JSON_OBJECT(
                               'ItemName',nam,
                               'month',mont,
                                'daily',daily)) as result;
    END IF;
END$$

CREATE PROCEDURE `1200002` (IN `request` JSON)   BEGIN
    DECLARE nam varchar(30);
    DECLARE mont decimal(10,2);
    DECLARE daily decimal(10,2);
    DECLARE num varchar(20);
    SET nam = json_value(request, '$.itemName');
    SET mont = json_value(request, '$.monthly');
    set num = (select iName from items where iName = nam and itemId != json_value(request,'$.itemId'));
    IF num IS NOT NULL THEN
	  SELECT JSON_OBJECT('errorCode',0,'errorMsg','item already exist') as result;
    ELSE
       UPDATE items
      SET iName = nam,
      mRent = mont
      where itemId= json_value(request,'$.itemId');
      SELECT JSON_OBJECT('errorCode',1,'errorMsg','Inserted Successful','result',JSON_OBJECT(
                               'ItemName',nam,
                               'month',mont,
                                'daily',daily)) as result;
    END IF;
END$$

CREATE PROCEDURE `1200005` (IN `request` JSON)   BEGIN

	DECLARE itemData JSON;
	DECLARE items JSON;
	DECLARE datas JSON;
	DECLARE fdata JSON;
	DECLARE i int;
	DECLARE icnt int;
	DECLARE aStock int;
	DECLARE rentStock int;
	DECLARE returnStock int;
	DECLARE pStock int;



	set itemData = (select concat('[',GROUP_CONCAT(JSON_OBJECT('itemId',itemId,
                               'iName',iName,
                               'mRent',mRent,
                               'tStock',tstock,
                               'status',status)),']') 
        from  
        (
        select i.itemId ,i.iName,i.mRent,i.tstock,i.status from items i GROUP BY i.itemId
        ) as rh);

	if JSON_EXTRACT(itemData,'$[0]') is null THEN
    	set itemData = (select JSON_ARRAY());
    end if;

	    set icnt = JSON_LENGTH(itemData) - 1; 
		
		set datas = (SELECT JSON_ARRAY());
		set fdata = (SELECT JSON_ARRAY());
		set i = 0;
		OuterLoop : LOOP
			IF  i > icnt THEN
				LEAVE OuterLoop;
			END IF;	
				set items = (select json_extract(itemData, concat('$[',i,']')));

				set rentStock = (SELECT SUM(rhc.qty) from renthistory rhc  
                                            where 
                                            rhc.`itemId` = JSON_VALUE(items,'$.itemId') 
                                            AND rhc.status = 1);

				set returnStock = (SELECT SUM(rhc.qty) from renthistory rhc  
                                            where 
                                            rhc.`itemId` = JSON_VALUE(items,'$.itemId') 
                                            AND rhc.status = 0);


				set pStock = IFNULL(rentStock-IFNULL(returnStock,0),0);
				set aStock = IFNULL(JSON_VALUE(items,'$.tStock')-pStock,0);

				set items = (select JSON_SET(items,'$.aStock',aStock));

				set fdata = (select JSON_ARRAY_APPEND(fdata,'$',items));
		set i = i+1;
		END LOOP;
		select JSON_OBJECT('errorCode',1,'result',fdata) as result;
END$$

CREATE PROCEDURE `1200006` (IN `request` JSON)   BEGIN

	DECLARE itemData JSON;
	DECLARE cid int;

  set cid = JSON_VALUE(request,'$.cId');
	set itemData = (select concat('[',GROUP_CONCAT(JSON_OBJECT('itemId',itemId,
                               'iName',iName,
                               'mRent',mRent,
                               'tStock',tstock,
                               'status',status)),']') 
                from (select i.* from renthistory rh INNER JOIN renthistorymaster rhm on rh.mId = rhm.mId inner join items i on i.itemId = rh.itemId where rhm.cId = cid GROUP BY i.itemId) as datatbl);
    if JSON_EXTRACT(itemData,'$[0]') is null THEN
    	set itemData = (SELECT JSON_ARRAY());
    end if;
		select JSON_OBJECT('errorCode',1,'result',itemData) as result;
END$$

CREATE PROCEDURE `1300001` (IN `request` JSON)   BEGIN
	declare stats int;
    declare qtty int;
    declare sqty int;
    set stats = JSON_VALUE(request,'$.status');
    set qtty = JSON_VALUE(request,'$.qty');
    set sqty = (select tStock from items where itemId = JSON_VALUE(request,'$.itemId'));
    insert into stockupdate(sDate,qty,itemId,updateStatus) values(curdate(),qtty,JSON_VALUE(request,'$.itemId'),stats);
    if stats = 1 then
		update items set tstock = tstock + qtty where itemId = JSON_VALUE(request,'$.itemId');
        select JSON_OBJECT("errorCode",1,"msg","Updated Successfully") as result;
	else
		if sqty < qtty then
			select JSON_OBJECT("errorCode",0,"msg","QUATITY is higher than stock QUATITY") as result;
        else
			update items set tstock = tstock - qtty where itemId = JSON_VALUE(request,'$.itemId');
            select JSON_OBJECT("errorCode",1,"msg","Updated Successfully") as result;
		end if;
	end if;
END$$

CREATE PROCEDURE `1300005` (IN `request` JSON)   BEGIN
	SELECT JSON_OBJECT('errorCode',1,'result',JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT(
                               'sId',sId,
                               'date',sDate,
                               'qty',qty,
                               'status',updateStatus
                               )))) as result from stockupdate WHERE itemId=JSON_VALUE(request,'$.itemId');

END$$

CREATE PROCEDURE `1400001` (IN `request` JSON)   PRO: BEGIN
	  declare id int;
    declare stats int;
    declare i int;
    declare cnt int;
    declare cnt1 int;
    declare cmpData1 JSON;
    declare ratest int;
    declare mid int;
    DECLARE hid int;
    declare datec varchar(15);
    declare stas int;
    declare mrate decimal;
    set stas = 0;
    set datec = (select curdate());
    set id = JSON_VALUE(request,'$.cId');
    set stats = JSON_VALUE(request,'$.status');
    set i = (select count(mId) from renthistorymaster where cDate = datec and cId=id);
    if stats = 1 then
		insert into renthistorymaster(cDate, cId,status) values(json_value(request,'$.date'),id,stats);
		set cnt = json_length(json_extract(request,'$.items')) - 1;
        set i = 0;
        set mid = (SELECT LAST_INSERT_ID());
		cmpinsert:  LOOP
			IF  i > cnt THEN
				LEAVE  cmpinsert;
			END IF;
			set cmpData1 = json_extract(request, concat('$.items[',i,']'));
			insert into renthistory(mId,itemId,qty,hDate,note,status,pending) VALUES(mid,json_value(cmpData1,'$.itemId'), json_value(cmpData1,'$.qty'),datec,json_value(cmpData1,'$.note'),stats,json_value(cmpData1,'$.qty'));
			set ratest = (select count(rId) from ratecard where cId = id and itemId = json_value(cmpData1,'$.itemId'));
			if ratest = 0 then
				set mrate = (select mRent from items where itemId = json_value(cmpData1,'$.itemId'));
				insert into ratecard(itemId,cId,rate,status) value(json_value(cmpData1,'$.itemId'),id,mrate,1);
			end if;
			SET  i = i + 1;
		END LOOP;
		select JSON_OBJECT("errorCode",1,"errorMsg","Inserted Successfully") as result;
    else
		insert into renthistorymaster(cDate, cId,status) values(json_value(request,'$.date'),id,stats);
		set cnt = json_length(json_extract(request,'$.items')) - 1;
        set i = 0;
        set mid = (SELECT LAST_INSERT_ID());
		cmpinsert:  LOOP
			IF  i > cnt THEN
				LEAVE  cmpinsert;
			END IF;
			set cmpData1 = json_extract(request, concat('$.items[',i,']'));
			insert into renthistory(mId,itemId,qty,hDate,note,status,pending) VALUES(mid,json_value(cmpData1,'$.itemId'), json_value(cmpData1,'$.qty'),datec,json_value(cmpData1,'$.note'),stats,1);
			set ratest = (select count(rId) from ratecard where cId = id and itemId = json_value(cmpData1,'$.itemId'));
            set hid = (select LAST_INSERT_ID());
			set ratest = (select count(rId) from ratecard where cId = id and itemId = json_value(cmpData1,'$.itemId'));
			SET  i = i + 1;
		END LOOP;
		select JSON_OBJECT("errorCode",1,"errorMsg","Inserted Successfully") as result;
    end if;
END$$

CREATE PROCEDURE `1400002` (IN `request` JSON)   BEGIN
	declare ststs int;
    declare qsty int;
    declare id int;
    set ststs = (select status from renthistory where hId = json_value(request,'$.hId'));
    set id = (select itemId from renthistory where hId = json_value(request,'$.hId'));
    if ststs = 1 then
		set qsty = (select qty from renthistory where hId = json_value(request,'$.hId'));
        set qsty = json_value(request,'$.qty') - qsty;
		update renthistory 
        set hDate = json_value(request,'$.date'),
        qty = json_value(request,'$.qty')
        where hId = json_value(request,'$.hId');
        update dailynotes set nDate = json_value(request,'$.date') where cId = (select cId from renthistory where hId = json_value(request,'$.hId') );
		select JSON_OBJECT("errorCode",1,"errorMsg","Update Successfully") as result;
	else
		select JSON_OBJECT("errorCode",0,"errorMsg","Wrong Status") as result;
	end if;
END$$

CREATE PROCEDURE `1400005` (IN `request` JSON)   BEGIN
	select json_object("errorCode",1,"result",json_array(group_concat(json_object(
		'hId',rh.hId,
        'item',it.iName,
        'date',rh.hDate,
        'rate',rc.rate,
        'qty' ,rh.qty
    )))) as result from renthistory rh inner join renthistorymaster rhm on rhm.mId = rh.mId inner join items it on it.itemId = rh.itemId inner join ratecard rc on rc.itemId = it.itemId and rhm.cId = rc.cId where rh.mId = json_value(request,'$.mId');
END$$

CREATE PROCEDURE `1400006` (IN `request` JSON)   BEGIN
	DECLARE masterData JSON;
    DECLARE datas JSON;
    DECLARE rnthsry JSON;
    DECLARE cnt int;
    declare pendingsum int;
    DECLARE i int;
    set masterData =
	(select concat('[',group_concat(json_object(
		    'mId',mId,
        'Date',cDate,
        'status',status
    )ORDER BY mId DESC),']') as result from renthistorymaster where cId = json_value(request,'$.cId')); 
    set datas = (select JSON_ARRAY());
    set cnt = IFNULL((select JSON_LENGTH(masterData)-1),-1);
    set i = 0;
    cmpinsert1:  LOOP
			IF  i > cnt THEN
				LEAVE  cmpinsert1;
			END IF;
            set rnthsry = json_extract(masterData, concat('$[',i,']'));
            set pendingsum = (select sum(pending) from renthistory where mId = JSON_VALUE(rnthsry,"$.mId"));
            set datas = (select JSON_ARRAY_APPEND(datas, '$', JSON_OBJECT(
        "mId",cast(JSON_VALUE(rnthsry,"$.mId") as unsigned),
        "Date",JSON_VALUE(rnthsry,"$.Date"),
         "status",cast(JSON_VALUE(rnthsry,"$.status") as unsigned),
         "pending",IFNULL(cast(pendingsum as unsigned),0)
         )));
            set i=i+1;
     END LOOP;
    select JSON_OBJECT('errorCode',1,'result',datas) as result;
END$$

CREATE PROCEDURE `1500002` (IN `request` JSON)   BEGIN
    declare datas JSON;
    declare items JSON;
    declare cmpData JSON;
    declare cstatin int;
    declare cstatout int;
    declare pending int;
    declare cid int;
    declare j int;
    declare cct int;
    set cid = JSON_VALUE(request,'$.cId');
	set items = (select concat('[',GROUP_CONCAT(JSON_OBJECT('id',itemId,'name',iName)),']') from items);
    set cct = JSON_LENGTH(items) - 1;
    set j=0;
    set datas = (SELECT JSON_ARRAY());
    cmpip : LOOP
				IF  j > cct THEN
					LEAVE  cmpip;
				END IF;
                set cmpData = (select json_extract(items, concat('$[',j,']')));
                set cstatin = (select COALESCE(sum(rh.qty),0) from renthistory rh inner join renthistorymaster rhm on rh.mId = rhm.mId where rh.itemId = JSON_VALUE(cmpData,'$.id') and rhm.cId = cid and rh.status = 1);
                set cstatout = (select COALESCE(sum(rh.qty),0) from renthistory rh inner join renthistorymaster rhm on rh.mId = rhm.mId where rh.itemId = JSON_VALUE(cmpData,'$.id') and rhm.cId = cid and rh.status = 0);
                set pending = cstatin - cstatout;
                if pending > 0 THEN
                	set datas = (select JSON_ARRAY_APPEND(datas, '$', JSON_OBJECT('itemId',JSON_VALUE(cmpData,'$.id'),'itemName',JSON_VALUE(cmpData,'$.name'),"pending",pending)));
                end if;
                set j = j +1;
                END LOOP;
                select JSON_OBJECT('errorCode',1,'result',datas) as result;
END$$

CREATE PROCEDURE `1500005` (IN `request` JSON)   BEGIN
	  declare items JSON;
    declare dates JSON;
    declare cid int;
    declare bdata1 JSON;
    declare bdata2 JSON;
    declare bdatas JSON;
    declare datas JSON;
    declare i int;
    declare j int;
    declare cnt int;
    declare cct int;
    declare cmpData1 JSON;
    declare cmpData2 JSON;
    declare output JSON;
    set cid = JSON_VALUE(request,'$.cId');
	set items = (select concat('[',GROUP_CONCAT(JSON_OBJECT('id',itemId,'name',iName)),']') from (select i.itemId as itemId, i.iName as iName from renthistory rh INNER JOIN renthistorymaster rhm on rh.mId = rhm.mId inner join items i on i.itemId = rh.itemId where rhm.cId = cid GROUP BY i.itemId) as datatbl);
    
    set dates = (select concat('[',GROUP_CONCAT(JSON_OBJECT('date', hDate)),']') from (select hDate from renthistory where cId=cid group by hDate) as rh);
    if JSON_EXTRACT(dates,'$[0]') is null THEN
    	set dates = (SELECT JSON_ARRAY());
    end if;
    if JSON_EXTRACT(items,'$[0]') is null THEN
    	set items = (SELECT JSON_ARRAY());
    end if;
    
set cnt = JSON_LENGTH(dates) - 1;
    set cct = JSON_LENGTH(items) - 1;
    
    set i = 0;
    set datas = (SELECT JSON_ARRAY());
		cmpinsert:  LOOP
			IF  i > cnt THEN
				LEAVE  cmpinsert;
			END IF;
            set cmpData1 = (select json_extract(dates, concat('$[',i,']')));
            set bdatas = (select JSON_ARRAY(JSON_VALUE(cmpData1,'$.date')));
            set j=0;
            cmpip : LOOP
				IF  j > cct THEN
					LEAVE  cmpip;
				END IF;
                set cmpData2 = (select json_extract(items, concat('$[',j,']')));
				set bdata1 = (select JSON_OBJECT('hId',rh.hId,'itemId',rh.itemId,'qty',SUM(rh.qty),'status',rh.status) from renthistory rh inner join renthistorymaster rhm on rhm.mId = rh.mId  where rhm.cId = cid and rh.hDate = JSON_VALUE(cmpData1,'$.date') and rh.itemId = JSON_VALUE(cmpData2,'$.id') and rh.status = 1 group by rh.hdate);
                if bdata1 is null then
					set bdata1 = JSON_OBJECT('hId',0,'itemId',JSON_VALUE(cmpData2,'$.id'),'qty',0,'status',1);
				end if;
                set bdata2 = (select JSON_OBJECT('hId',rh.hId,'itemId',rh.itemId,'qty',SUM(rh.qty),'status',rh.status) from renthistory rh inner join renthistorymaster rhm on rhm.mId = rh.mId  where rhm.cId = cid and rh.hDate = JSON_VALUE(cmpData1,'$.date') and rh.itemId = JSON_VALUE(cmpData2,'$.id') and rh.status = 0 group by rh.hdate);
                if bdata2 is null then
					set bdata2 = JSON_OBJECT('hId',0,'itemId',JSON_VALUE(cmpData2,'$.id'),'qty',0,'status',0);
				end if;
                set bdatas = (select JSON_ARRAY_APPEND(bdatas, '$', JSON_OBJECT('outgoing',bdata1,'incoming',bdata2)));
                set j = j + 1;
            END LOOP;
            set datas = (select JSON_ARRAY_APPEND(datas, '$', bdatas));
			SET  i = i + 1;
		END LOOP;
		select JSON_OBJECT('errorCode',1,'result',JSON_OBJECT('item',items,'data',datas)) as result;
END$$

CREATE PROCEDURE `1600002` (IN `request` JSON)   BEGIN
	DECLARE pric decimal(20,2);
    DECLARE unitp decimal(20,2);
    DECLARE dat date;
    declare days int;
    DECLARE cid int;
    DECLARE itemid int;
    DECLARE qtyy int;
    set cid = (SELECT rentcalculations.cId from rentcalculations where rId = JSON_VALUE(request,'$.rId'));
    set dat = (SELECT rentDate from rentcalculations where rId = JSON_VALUE(request,'$.rId'));
    
    
    set qtyy = (SELECT qty from rentcalculations where rId = JSON_VALUE(request,'$.rId'));
    set itemid = (SELECT rentcalculations.itemid from rentcalculations where rId = JSON_VALUE(request,'$.rId'));
    
    set unitp = (select rate from ratecard where itemId = itemid and cId =cid  limit 1);
    
    set days = DATEDIFF(JSON_VALUE(request,'$.returnDate'), dat);
    if days > 30 then
    	set pric = (unitp + (days - 30) * (unitp /30)) * qtyy;
    else
    	set pric = unitp * qtyy;
    end if;
    update rentcalculations set returnDate = JSON_VALUE(request,'$.returnDate'), price = pric where rId = JSON_VALUE(request,'$.rId');
    SELECT JSON_OBJECT("errorCode",1,"errorMsg","Succesfully Updated") as result;
END$$

CREATE PROCEDURE `1600005` (IN `request` JSON)   BEGIN
	select json_object("errorCode",1,"result",json_array(group_concat(json_object(
		'rId',rc.rId,
        'itemId',rc.itemid,
        'rentDate',rc.rentDate,
        'returnDate',rc.returnDate,
        'days',DATEDIFF(rc.returnDate,rc.rentDate),
        'qty',rc.qty,
        'price',rc.price
    )))) as result from rentcalculations rc where rc.cId = json_value(request,'$.cId') AND rc.itemid= json_value(request,'$.itemId');
END$$

CREATE PROCEDURE `1700001` (IN `request` JSON)   BEGIN
	insert into paymentcollection(cId,pdate,amount) values(json_value(request,"$.cId"),curdate(),json_value(request,"$.amount"));
    select JSON_OBJECT("errorCode",1,"result","Add successfully") as result;
END$$

CREATE PROCEDURE `1700002` (IN `request` JSON)   BEGIN
	update paymentcollection set amount = json_value(request,"$.amount") where pId = json_value(request,"$.pId") ;
    select JSON_OBJECT("errorCode",1,"result","Add successfully") as result;
END$$

CREATE PROCEDURE `1700003` (IN `request` JSON)   BEGIN
	delete from paymentcollection where pId = json_value(request,"$.pId");
    select JSON_OBJECT("errorCode",1,"result","Add successfully") as result;
END$$

CREATE PROCEDURE `1700005` (IN `request` JSON)   BEGIN
	DEClARE datas JSON;
    DECLARE items JSON;
    DECLARE payments JSON;
    set datas = (SELECT JSON_ARRAY());
    set items = (select JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT("itemName",itemName,"amount",amount))) from (select i.iName as itemName ,SUM(rc.price) as amount from rentcalculations rc inner join items i on rc.itemid = i.itemId where cId=JSON_VALUE(request,"$.cId") group by rc.itemid) as calc);
    set datas = (select JSON_ARRAY_APPEND(datas, '$', items));
    set payments = (select JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT("pId",pId,"date",pDate,"amount",amount))) from paymentcollection where cId = JSON_VALUE(request,"$.cId"));
    set datas = (select JSON_ARRAY_APPEND(datas, '$', payments));
    select JSON_OBJECT("errorCode",1,"result",datas) as result;
END$$

CREATE PROCEDURE `1800002` (IN `request` JSON)   BEGIN
	UPDATE ratecard set rate = JSON_VALUE(request,'$.rate') where rId = JSON_VALUE(request,'$.rId');
    select JSON_OBJECT("errorCode",1,"errorMsg","Updated Successfully") as result;
END$$

CREATE PROCEDURE `1800005` (IN `request` JSON)   BEGIN
	SELECT JSON_OBJECT("errorCode",1,"result",JSON_ARRAY(
    GROUP_CONCAT(
    	JSON_OBJECT(
        "rId",rc.rId,
        "rate",rc.rate,
        "itemName",i.iName
        )
    ))) as result FROM ratecard rc INNER JOIN items i on i.itemId = rc.itemId where rc.cId = JSON_VALUE(request,'$.cId');
END$$

CREATE PROCEDURE `2300005` (IN `request` JSON)   BEGIN
	declare tcustomer int;
    declare titems int;
    declare tamount decimal(20,2);
    declare tusers int;
    declare total json;
    declare graph json;
    declare dates json;
    declare grphData json;
    DECLARE cmpData1 date;
    DECLARE pielabel json;
    DECLARE piedata json;
    DECLARE pie json;
    DECLARE cnt int;
    DECLARE i int;
    declare amt decimal(20,2);
	set tcustomer = IFNULL((select count(cId) FROM customermaster where status  = 0 ),0);
    set titems = IFNULL((select count(itemId) FROM items),0);
    set tamount = IFNULL((select sum(amount) FROM paymentcollection ),0);
    set tusers = IFNULL((select count(uId) FROM users where status = 1),0);
    
     set dates = (select JSON_ARRAY(
     DATE_SUB(CURDATE(), INTERVAL 6 DAY),
     DATE_SUB(CURDATE(), INTERVAL 5 DAY),
     DATE_SUB(CURDATE(), INTERVAL 4 DAY),
     DATE_SUB(CURDATE(), INTERVAL 3 DAY),
     DATE_SUB(CURDATE(), INTERVAL 2 DAY),
     DATE_SUB(CURDATE(), INTERVAL 1 DAY),
     DATE_SUB(CURDATE(), INTERVAL 0 DAY)));
     
     set grphData = (SELECT JSON_ARRAY());
     set cnt = json_length(dates) - 1;
        set i = 0;
		cmpinsert:  LOOP
			IF  i > cnt THEN
				LEAVE  cmpinsert;
			END IF;
            set cmpData1 = DATE_SUB(CURDATE(), INTERVAL (cnt-i) DAY);
            set amt = (select sum(amount) FROM paymentcollection where pDate = cmpData1 );
            if amt is null THEN
            	set amt = 0;
            end if;
           set grphData = (select JSON_ARRAY_APPEND(grphData, '$', amt));
            set i = i+1;
        end loop;
       set pielabel =  (select JSON_ARRAYAGG(name) from (select i.iName as name ,sum(rh.qty) as qty from renthistory rh INNER JOIN items i on rh.itemId = i.itemId where rh.hDate = curdate() and rh.status=1 group by i.itemId) as tbl);
        set piedata =(select JSON_ARRAYAGG(cast(qty as signed)) from (select i.iName as name ,sum(rh.qty) as qty from renthistory rh INNER JOIN items i on rh.itemId = i.itemId where rh.hDate = curdate() and rh.status=1 group by i.itemId) as tbl);
        if json_value(pielabel,'$[0]') = "" THEN
        	set pielabel = (select JSON_ARRAY());
            set piedata = (select JSON_ARRAY());
         end if;
       set pie = (select JSON_OBJECT("pieLabel",pielabel,"pieData",piedata));
        
   set total = (select JSON_OBJECT("tCustomer",cast(tcustomer as signed),"tItem",cast(titems as signed),"tAmount",cast(tamount as decimal(20,2)),"tuser",cast(tusers as signed)));
    set graph = (select JSON_OBJECT("label",dates,"data",grphData));
    select JSON_OBJECT("errorCode",1,"result",JSON_OBJECT("total",total,"graph",graph,"pie",pie)) as result;
END$$

CREATE PROCEDURE `2300006` (IN `request` JSON)   BEGIN
	DECLARE itemData JSON;
    DECLARE customerData JSON;
    DECLARE id JSON;
    DECLARE label JSON;
    DECLARE datas JSON;
    DECLARE fdata JSON;
    DECLARE i int;
    DECLARE j int;
    DECLARE itId JSON;
    DECLARE idatas JSON;
    DECLARE cnt int;
    DECLARE sts int;
    DECLARE rentstock int;
    DECLARE retrunStock int;
    DECLARE pendingStock int;
    DECLARE cntitem int;
    declare activeCust int;
    
    set itemData = JSON_VALUE(request,'$.items') ;
        if JSON_LENGTH(itemData) = 0  or itemData is null then 
              set itemData = (select concat('[',GROUP_CONCAT(JSON_OBJECT('itemId',itemId,'itemName',iName)),']') from items );
        end if;
    set customerData = (select concat('[',GROUP_CONCAT(JSON_OBJECT('cId',`cId`,'name',`cName`,'Phone',`mobile`)),']') from customermaster where status = 0);

    if JSON_EXTRACT(itemData,'$[0]') is null THEN
    	set itemData = (select JSON_ARRAY());
    end if;
    
    if JSON_EXTRACT(customerData,'$[0]') is null THEN
    	set customerData = (select JSON_ARRAY());
    end if;

   	set i=0;
    set cnt = JSON_LENGTH(customerData) - 1;
    set cntitem = JSON_LENGTH(itemData) - 1;

    set datas = (SELECT JSON_ARRAY());
    set label = (SELECT JSON_ARRAY());

    StartLoop : LOOP
    	IF i > cnt THEN
        		LEAVE StartLoop;
        end if;
        set activeCust = 0;
			set fdata = (SELECT JSON_ARRAY());
      if i=0 then
            set label = (select JSON_ARRAY_APPEND(label,'$',"customer Name"));   
            end if; 
        	set id = (select json_extract(customerData, concat('$[',i,']')));
        	set fdata = (select JSON_ARRAY_APPEND(fdata,'$',JSON_OBJECT('id',JSON_VALUE(id,'$.cId'),'name',JSON_VALUE(id,'$.name'),'mobile',JSON_VALUE(id,'$.Phone'))));
			set j=0;
            		InnerLoop : LOOP
                    	  IF j > cntitem THEN
                        		LEAVE InnerLoop;
                        END IF;
                            set itId= (select json_extract(itemData, concat('$[',j,']')));
        	                set idatas =(select JSON_ARRAY(JSON_VALUE(itId,'$.itemId')));
                               if i=0 then
                               set label = (select JSON_ARRAY_APPEND(label,'$',JSON_VALUE(itId,'$.itemName')));
                               end if;
                            	set rentstock = (SELECT SUM(rhc.qty) from renthistory rhc 
                                            inner join renthistorymaster rhm on rhc.mId = rhm.mId 
                                            where 
                                            rhm.cId = JSON_VALUE(id,'$.cId') AND 
                                            rhc.`itemId` = JSON_VALUE(itId,'$.itemId') 
                                            AND rhc.status = 1);
                                set retrunStock = (SELECT SUM(rhc.qty) from renthistory rhc 
                                            inner join renthistorymaster rhm on rhc.mId = rhm.mId 
                                            where 
                                            rhm.cId = JSON_VALUE(id,'$.cId') AND 
                                            rhc.`itemId` = JSON_VALUE(itId,'$.itemId') 
                                            AND rhc.status = 0);
                                 if rentStock is null THEN
                                 	set rentStock = 0;
                                 end if;
                                 if retrunStock is null THEN
                                 	set retrunStock = 0;
                                 end if;
                                set pendingStock = rentstock - retrunStock;
                                if pendingStock > 0 then
                                  set activeCust = 1;
                                end if;
                          set fdata = (select JSON_ARRAY_APPEND(fdata,'$',JSON_OBJECT('pendingStock',pendingStock)));
                          set j=j+1;
                    END LOOP;
                    set fdata = (select JSON_ARRAY_APPEND(fdata,'$',JSON_OBJECT('pendingAmount',0)));
                    set datas = (select JSON_ARRAY_APPEND(datas,'$',fdata));
                    if activeCust = 0 then
                      set datas = (select JSON_REMOVE(datas,concat('$[',JSON_LENGTH(datas)-1,']')));
                    end if;
        set i = i+1;
    END LOOP;
    set label =(select JSON_ARRAY_APPEND(label,'$','PendingAmount'));
    if cnt = -1 THEN
     set label =(select JSON_ARRAY());
    end if;
    select JSON_OBJECT('errorCode',1,'result',JSON_OBJECT('label',label,'data',datas)) as result;
END$$

CREATE PROCEDURE `2300007` (IN `request` JSON)   BEGIN	DECLARE date1 date;
        DECLARE date2 date;
        DECLARE datas JSON;
        DECLARE dt JSON;
        DECLARE items JSON;
        DECLARE dates JSON;
        DECLARE label JSON;
        DECLARE itemData JSON;
        DECLARE fdata JSON;
        DECLARE perData JSON;
        DECLARE iqty int;
        DECLARE icnt int;
        DECLARE itemCount int;
        DECLARE i int;
        DECLARE j int;
        DECLARE sts int; 
        set sts = 0;

        set date1 = IFNULL(JSON_VALUE(request,'$.from'),0);
        set date2 = IFNULL(JSON_VALUE(request,'$.to'),0);
        

        set dates =
        (
            select concat('[',GROUP_CONCAT(JSON_OBJECT('hDate',hDate)),']') 
                from  
                (
                select hDate from renthistory 
                where status =1 AND hDate BETWEEN date1 AND date2 GROUP BY `hDate`
                ) as rh
        );

        if JSON_EXTRACT(dates,'$[0]') is null THEN
            set dates = (select JSON_ARRAY());
        end if;
        set itemData = JSON_VALUE(request,'$.items');
        if JSON_EXTRACT(itemData,'$[0]') is null THEN
        set itemData = (
            select concat('[',GROUP_CONCAT(JSON_OBJECT('itemId',itemId,'itemName',itemName)),']') 
            from  
            (
            select i.itemId as itemId,i.iName as itemName from renthistory rh 
            inner join items i on rh.itemId = i.itemId
            where rh.status = 1 AND rh.hDate BETWEEN date1 AND date2 GROUP BY rh.itemId
            ) as ii
        );
        end if;
        

        if JSON_EXTRACT(itemData,'$[0]') is null THEN
            set itemData = (select JSON_ARRAY());
        end if;


        set icnt = JSON_LENGTH(dates) - 1; 
        set itemCount = JSON_LENGTH(itemData) -1;
        
        
        
        set label = (SELECT JSON_ARRAY());
        set fdata = (SELECT JSON_ARRAY());
        set i = 0;
        
        FirstLoop : LOOP
            IF i > itemCount THEN
                LEAVE FirstLoop;
            END IF;
        set datas = (SELECT JSON_ARRAY());

        set items = (select json_extract(itemData, concat('$[',i,']')));
                        set j=0;
                        
                        InnerLoop : LOOP 
                            IF j > icnt THEN
                                LEAVE InnerLoop;
                            END IF;
                                set dt = (select json_extract(dates, concat('$[',j,']')));
                                set iqty = IFNULL((
                            select SUM(rh.qty) from renthistory rh 
                            where rh.itemId = JSON_VALUE(items,'$.itemId') AND rh.hDate=JSON_VALUE(dt,'$.hDate') and rh.status = 1
                            ),0);  
                        set datas = ((select JSON_ARRAY_APPEND(datas,'$',iqty)));
                            if sts = 0 THEN
                             set label = (select JSON_ARRAY_APPEND(label,'$',JSON_VALUE(dt,'$.hDate'))); 
                            END IF;
                        set j=j+1;
                        END LOOP;
                        set perData = (select JSON_OBJECT('itemName',JSON_VALUE(items,'$.itemName'), 'dataSet',datas));
                        set fdata = (select JSON_ARRAY_APPEND(fdata,'$',perData));
            set i = i+1;
            set sts = 1;
        END LOOP;
        
        if icnt = -1 THEN
        set label = (select JSON_ARRAY()); 
        end if;

        if itemCount = -1 THEN
        set fdata =(select JSON_ARRAY());
        end if;

        select JSON_OBJECT('errorCode',1,'result',JSON_OBJECT('label',label,'data',fdata)) as result;
    
    END$$

CREATE PROCEDURE `newrentcalculation` (IN `itemid` INT(10), IN `dat` DATE, IN `cid` INT(10), IN `qtyy` INT(10))   BEGIN
	DECLARE pric decimal(20,2);
    DECLARE unitp decimal(20,2);
    declare days int;
    set unitp = (select rate from ratecard where itemId = itemid and cId =cid  limit 1);
    set days = DATEDIFF(CURDATE(), dat);
    if days > 30 then
    	set pric = (unitp + (days - 30) * (unitp /30)) * qtyy;
    else
    	set pric = unitp * qtyy;
    end if;
    insert into rentcalculations(itemId,rentDate,returnDate,cId,price,qty) values(itemid,dat,CURDATE(),cid,pric,qtyy);
END$$

CREATE PROCEDURE `returnCalculate` (IN `request` JSON)   BEGIN
	DECLARE pqty int;
    DECLARE qty1 int;
    DECLARE iId int;
    declare rnthsry JSON;
    declare rnthsry1 JSON;
    DECLARE datas JSON;
    DECLARE cnt int;
    DECLARE i int;
    DECLARE cid int;
    set cid = (select json_value(request,'$.cId'));
    set rnthsry = (select concat("[",GROUP_CONCAT(JSON_OBJECT("hId",rh.hId)),"]") from renthistory rh inner join renthistorymaster rhm on rh.mId = rhm.mId where rhm.cId = cid and rh.status=0 and rh.pending!=0);
    if rnthsry is null then
		set rnthsry = (select JSON_ARRAY());
	end if;
    set i=0;
    set cnt = (select JSON_LENGTH(rnthsry)-1);
    cmpinsert1:  LOOP
			IF  i > cnt THEN
				LEAVE  cmpinsert1;
			END IF;
            SELECT i;
			set rnthsry1 = json_extract(rnthsry, concat('$[',i,']'));
            set pqty = (select renthistory.qty from renthistory where hId = JSON_VALUE(rnthsry1,'$.hId'));
			set iId = (select renthistory.itemId from renthistory where hId = JSON_VALUE(rnthsry1,'$.hId'));
			cmpip : LOOP
				IF  pqty = 0 THEN
					LEAVE  cmpip;
				END IF;
                SELECT pqty;
                set qty1 = (select rh.pending from renthistory rh inner join renthistorymaster rhm on rh.mId = rhm.mId where rh.itemId = iId and rh.status = 1 and rh.pending != 0 and rhm.cId = cid order by rh.hId LIMIT 1);
                set datas = (select JSON_OBJECT("hId", rh.hId,"date",rh.hDate) from renthistory rh inner join renthistorymaster rhm on rh.mId = rhm.mId where rh.itemId = iId and rh.status = 1 and rh.pending != 0 and rhm.cId = cid order by rh.hId LIMIT 1);
				if pqty < qty1 THEN
					update renthistory set pending = pending - pqty where hId = JSON_VALUE(datas,'$.hId');
					call newrentcalculation(iId,JSON_VALUE(datas,'$.date'),cid,pqty);
					set pqty = 0;
				else
					update renthistory set pending = 0 where hId = JSON_VALUE(datas,'$.hId');
					call newrentcalculation(iId,JSON_VALUE(datas,'$.date'),cid,qty1);
					set pqty = pqty - qty1;
				end if;
            END LOOP;
            update renthistory set pending = 0 where hId = JSON_VALUE(rnthsry1,'$.hId');
            set i= i+1;
     END LOOP;
     SELECT json_object("errorCode",1,"errorMsg","Calculated successfull") as result;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `customermaster`
--

CREATE TABLE `customermaster` (
  `cId` int(10) NOT NULL,
  `cName` varchar(70) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `alterMobile` varchar(20) NOT NULL,
  `address` varchar(150) NOT NULL,
  `proof` longtext NOT NULL,
  `coName` varchar(50) NOT NULL,
  `coMobile` varchar(20) NOT NULL,
  `status` int(10) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customermaster`
--

INSERT INTO `customermaster` (`cId`, `cName`, `mobile`, `alterMobile`, `address`, `proof`, `coName`, `coMobile`, `status`) VALUES
(1010, 'MUHAMMED RIYAS', '8714914848', '', 'kattuparambil', '', '', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `dId` int(10) NOT NULL,
  `cId` int(10) NOT NULL,
  `docData` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `itemId` int(10) NOT NULL,
  `iName` varchar(60) NOT NULL,
  `mRent` decimal(10,2) NOT NULL,
  `tStock` int(10) NOT NULL,
  `status` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`itemId`, `iName`, `mRent`, `tStock`, `status`) VALUES
(1, 'Shutter', 30.00, 100, 0);

-- --------------------------------------------------------

--
-- Table structure for table `login_session`
--

CREATE TABLE `login_session` (
  `sId` int(10) NOT NULL,
  `uId` int(10) NOT NULL,
  `token` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp(),
  `platform` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paymentcollection`
--

CREATE TABLE `paymentcollection` (
  `pId` int(10) NOT NULL,
  `cId` int(10) NOT NULL,
  `pDate` date NOT NULL,
  `amount` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ratecard`
--

CREATE TABLE `ratecard` (
  `rId` int(10) NOT NULL,
  `itemId` int(10) NOT NULL,
  `cId` int(10) NOT NULL,
  `rate` decimal(10,2) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rentcalculations`
--

CREATE TABLE `rentcalculations` (
  `rId` int(10) NOT NULL,
  `itemid` int(10) NOT NULL,
  `rentDate` date NOT NULL,
  `returnDate` date NOT NULL,
  `cId` int(10) NOT NULL,
  `price` decimal(20,2) NOT NULL,
  `qty` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `renthistory`
--

CREATE TABLE `renthistory` (
  `hId` int(10) NOT NULL,
  `mId` int(10) NOT NULL,
  `itemId` int(10) NOT NULL,
  `qty` int(10) NOT NULL,
  `hDate` date NOT NULL,
  `note` text NOT NULL,
  `status` int(3) NOT NULL,
  `pending` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `renthistorymaster`
--

CREATE TABLE `renthistorymaster` (
  `mId` int(11) NOT NULL,
  `cDate` date NOT NULL,
  `cId` int(11) NOT NULL,
  `status` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stockupdate`
--

CREATE TABLE `stockupdate` (
  `sId` int(10) NOT NULL,
  `sDate` date NOT NULL,
  `qty` int(10) NOT NULL,
  `itemId` int(10) NOT NULL,
  `updateStatus` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uId` int(10) NOT NULL,
  `userName` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `userType` varchar(30) DEFAULT NULL,
  `status` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uId`, `userName`, `password`, `userType`, `status`) VALUES
(1, 'admin@123.com', '21232f297a57a5a743894a0e4a801fc3', 'admin', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customermaster`
--
ALTER TABLE `customermaster`
  ADD PRIMARY KEY (`cId`);

--
-- Indexes for table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`dId`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`itemId`);

--
-- Indexes for table `login_session`
--
ALTER TABLE `login_session`
  ADD PRIMARY KEY (`sId`);

--
-- Indexes for table `paymentcollection`
--
ALTER TABLE `paymentcollection`
  ADD PRIMARY KEY (`pId`);

--
-- Indexes for table `ratecard`
--
ALTER TABLE `ratecard`
  ADD PRIMARY KEY (`rId`);

--
-- Indexes for table `rentcalculations`
--
ALTER TABLE `rentcalculations`
  ADD PRIMARY KEY (`rId`);

--
-- Indexes for table `renthistory`
--
ALTER TABLE `renthistory`
  ADD PRIMARY KEY (`hId`),
  ADD KEY `mId` (`mId`);

--
-- Indexes for table `renthistorymaster`
--
ALTER TABLE `renthistorymaster`
  ADD PRIMARY KEY (`mId`);

--
-- Indexes for table `stockupdate`
--
ALTER TABLE `stockupdate`
  ADD PRIMARY KEY (`sId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customermaster`
--
ALTER TABLE `customermaster`
  MODIFY `cId` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1011;

--
-- AUTO_INCREMENT for table `document`
--
ALTER TABLE `document`
  MODIFY `dId` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `itemId` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `login_session`
--
ALTER TABLE `login_session`
  MODIFY `sId` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `paymentcollection`
--
ALTER TABLE `paymentcollection`
  MODIFY `pId` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ratecard`
--
ALTER TABLE `ratecard`
  MODIFY `rId` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rentcalculations`
--
ALTER TABLE `rentcalculations`
  MODIFY `rId` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `renthistory`
--
ALTER TABLE `renthistory`
  MODIFY `hId` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `renthistorymaster`
--
ALTER TABLE `renthistorymaster`
  MODIFY `mId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stockupdate`
--
ALTER TABLE `stockupdate`
  MODIFY `sId` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uId` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `renthistory`
--
ALTER TABLE `renthistory`
  ADD CONSTRAINT `renthistory_ibfk_1` FOREIGN KEY (`mId`) REFERENCES `renthistorymaster` (`mId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
