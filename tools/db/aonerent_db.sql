-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 27, 2023 at 09:33 AM
-- Server version: 8.0.33-cll-lve
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aonerent_db`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1000001` (IN `request` JSON)   BEGIN
	declare sts int;
  SET SESSION group_concat_max_len = 1000000;
    set sts = (select count(uId) from users where username = json_value(request,"$.username"));
    if sts = 0 then
		insert into users(userName,password,userType,status) values(json_value(request,"$.username"),MD5(json_value(request,"$.password")),json_value(request,"$.usertype"),1);
		select JSON_OBJECT("errorCode",1,"result","Add successfully") as result;
    else
		select JSON_OBJECT("errorCode",0,"result","username already occure") as result;
	end if;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1000002` (IN `request` JSON)   BEGIN
 SET SESSION group_concat_max_len = 1000000;
	update users set userType = json_value(request,"$.userType") where uId=json_value(request,"$.uId");
    select JSON_OBJECT("errorCode",1,"result","updated successfully") as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1000003` (IN `request` JSON)   BEGIN
	 SET SESSION group_concat_max_len = 1000000;
  update users set status = 0 where uId=json_value(request,"$.uId");
    select JSON_OBJECT("errorCode",1,"result","updated successfully") as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1000005` (IN `request` JSON)   BEGIN
 SET SESSION group_concat_max_len = 1000000;
	select json_object("errorCode",1,"result",json_array(group_concat(json_object(
		'uId',uId,
        'username',userName,
        'userType',userType
    )))) as result from users where status =1;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1100001` (IN `request` JSON)   BEGIN
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
     SET SESSION group_concat_max_len = 1000000;
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
        INSERT INTO customermaster(cName,mobile,alterMobile,address,proof,coName,coMobile,status) VALUES(nam,mob,alterNum,plac,json_value(request,'$.proof'),json_value(request,'$.coName'),json_value(request,'$.coMobile'),json_value(request,'$.status'));
     set cid = LAST_INSERT_ID();
        SELECT JSON_OBJECT('errorCode',1,'errorMsg','Inserted Successful','result',JSON_OBJECT('cId',cid,'name',nam,'mobile',mob,'address',plac)) as result;
    END IF;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1100002` (IN `request` JSON)   BEGIN
    DECLARE nam varchar(30);
    DECLARE mob varchar(20);
    DECLARE plac text;
	DECLARE num varchar(20);
    DECLARE alterNum varchar(20);
     SET SESSION group_concat_max_len = 1000000;
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

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1100003` (IN `request` JSON)   BEGIN
	DECLARE num int;
   SET SESSION group_concat_max_len = 1000000;
    set num = (select cId from customermaster where cId = json_value(request,'$.cId'));
    IF num IS NULL THEN
     SELECT JSON_OBJECT('errorCode',0,'errorMsg','User Not Found') as result;
    ELSE
      DELETE FROM renthistorymaster WHERE cId = json_value(request,'$.cId');
      DELETE FROM paymentcollection WHERE cId = json_value(request,'$.cId');
      DELETE FROM ratecard WHERE cId = json_value(request,'$.cId');
      DELETE FROM rentcalculations WHERE cId = json_value(request,'$.cId');
      DELETE FROM extrapayment WHERE cId = json_value(request,'$.cId');
      UPDATE customermaster set status = 1
      where cId= json_value(request,'$.cId');
      SELECT JSON_OBJECT('errorCode',1,'errorMsg','Delete Successful') as result;
    END IF;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1100004` (IN `request` JSON)   BEGIN
	DECLARE num int;
   SET SESSION group_concat_max_len = 1000000;
    set num = (select cId from customermaster where cId = json_value(request,'$.cId'));
    IF num IS NULL THEN
     SELECT JSON_OBJECT('errorCode',0,'errorMsg','User Not Found') as result;
    ELSE
      update customermaster set status = 0 where cId = num ;
      SELECT JSON_OBJECT('errorCode',1,'errorMsg','Activated successfully') as result;
    END IF;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1100005` (IN `request` JSON)   BEGIN
DECLARE datas JSON;
  SET SESSION group_concat_max_len = 1000000;
	set datas = (SELECT JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT(
                               'cId',cId,
                               'cName',cName,
                               'mobile',mobile,
                               'altermobile',altermobile,
                               'address',address,
                               'proof',proof,
                               'coName',coName,
                               'coMobile',coMobile
                               ) ORDER BY cName)) as result from customermaster WHERE status = 0);
  select JSON_OBJECT('errorCode',1,'result',datas) as result;

END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1100006` (IN `request` JSON)   BEGIN
  SET SESSION group_concat_max_len = 1000000;
	SELECT JSON_OBJECT('errorCode',1,'result',JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT(
                               'cId',cId,
                               'cName',cName,
                               'mobile',mobile,
                               'altermobile',altermobile,
                               'address',address,
                               'proof',proof,
                               'coName',coName,
                               'coMobile',coMobile
                               ) ORDER BY cName))) as result from customermaster WHERE status=1;

END$$



CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1100007` (IN `request` JSON)   BEGIN
 SET SESSION group_concat_max_len = 1000000;
update customermaster set status = 0 where cId = json_value(request,'$.cId');
select JSON_OBJECT("errorCode",1,"errorMsg","Customer Activated");
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1100008` (IN `request` JSON)   BEGIN
 SET SESSION group_concat_max_len = 1000000;
	SELECT JSON_OBJECT('errorCode',1,'result',JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT(
                               'docData',docData,
        					   'dId',dId
                               )))) as result from customermaster WHERE cId = JSON_VALUE(request,'$.cId');

END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1100009` (IN `request` JSON)   BEGIN
  DECLARE documents JSON;
   SET SESSION group_concat_max_len = 1000000;
  set documents = (select JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT('dId',dId,'file',file))) from document WHERE cId = JSON_VALUE(request,'$.cId'));
  if documents is null or JSON_VALUE(documents,'$[0]') is null then
      set documents = (select json_array());
  end if;
	SELECT JSON_OBJECT('errorCode',1,'result',JSON_OBJECT(
                               'cId',cId,
                               'cName',cName,
                               'mobile',mobile,
                               'altermobile',altermobile,
                               'address',address,
                               'proof',proof,
                               'coName',coName,
                               'coMobile',coMobile,
                               'documents',documents
                               )) as result from customermaster WHERE cId = JSON_VALUE(request,'$.cId');

END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1100010` (IN `request` JSON)   BEGIN
  SET SESSION group_concat_max_len = 1000000;
	SELECT JSON_OBJECT('errorCode', 1, 'result', JSON_ARRAY(GROUP_CONCAT(
    JSON_OBJECT( 
        'cId', cm.cId, 
        'cName', cm.cName, 
        'mobile', cm.mobile, 
        'altermobile', cm.altermobile, 
        'address', cm.address, 
        'proof', cm.proof, 
        'coName', cm.coName, 
        'coMobile', cm.coMobile, 
        'lastupdate', rhm_max.updateDate
    )
    ORDER BY rhm_max.updateDate DESC
) 
)) AS result 
FROM customermaster cm
INNER JOIN (
    SELECT cId, MAX(updateDate) AS updateDate
    FROM renthistorymaster
    GROUP BY cId 
    ORDER BY MAX(updateDate) DESC
    LIMIT 30
) AS rhm_max ON rhm_max.cId = cm.cId
WHERE cm.status = 0 
LIMIT 30;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1100013` (IN `request` JSON)   BEGIN
	DECLARE num int;
   SET SESSION group_concat_max_len = 1000000;
    set num = (select cId from customermaster where cId = json_value(request,'$.cId'));
    IF num IS NULL THEN
     SELECT JSON_OBJECT('errorCode',0,'errorMsg','User Not Found') as result;
    ELSE
      DELETE FROM customermaster WHERE cId = json_value(request,'$.cId');
      DELETE FROM document WHERE cId = json_value(request,'$.cId');
      SELECT JSON_OBJECT('errorCode',1,'errorMsg','Delete Successful') as result;
    END IF;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1200001` (IN `request` JSON)   BEGIN
    DECLARE nam varchar(50);
    DECLARE mont decimal(10,2);
	  DECLARE stck int;
    DECLARE num varchar(50);
     SET SESSION group_concat_max_len = 1000000;
    SET nam = json_value(request, '$.itemName');
    SET mont = json_value(request, '$.monthly');
    SET stck = json_value(request, '$.stock');
    set num = (select iName from items where iName = nam);
    IF num IS NOT NULL THEN
	    SELECT JSON_OBJECT('errorCode',0,'errorMsg','item already exist') as result;
    ELSE
      INSERT INTO items(iName,mRent,tStock,status) VALUES(nam,mont,stck,0);
      SELECT JSON_OBJECT('errorCode',1,'errorMsg','Inserted Successful','result',JSON_OBJECT(
                              'itemId', LAST_INSERT_ID(),
                               'ItemName',nam,
                               'month',mont)) as result;
    END IF;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1200002` (IN `request` JSON)   BEGIN
    DECLARE nam varchar(30);
    DECLARE mont decimal(10,2);
    DECLARE daily decimal(10,2);
    DECLARE num varchar(20);
     SET SESSION group_concat_max_len = 1000000;
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

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1200005` (IN `request` JSON)   BEGIN

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
  SET SESSION group_concat_max_len = 1000000;
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

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1200006` (IN `request` JSON)   BEGIN

	DECLARE itemData JSON;
	DECLARE cid int;
  SET SESSION group_concat_max_len = 1000000;
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

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1300001` (IN `request` JSON)   BEGIN
	declare stats int;
    declare qtty int;
    declare sqty int;
     SET SESSION group_concat_max_len = 1000000;
    set stats = JSON_VALUE(request,'$.status');
    set qtty = JSON_VALUE(request,'$.qty');
    set sqty = (select tStock from items where itemId = JSON_VALUE(request,'$.itemId'));
    insert into stockupdate(sDate,qty,note,itemId,updateStatus) values(curdate(),qtty,JSON_VALUE(request,'$.note'),JSON_VALUE(request,'$.itemId'),stats);
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

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1300005` (IN `request` JSON)   BEGIN
  SET SESSION group_concat_max_len = 1000000;
	SELECT JSON_OBJECT('errorCode',1,'result',JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT(
                               'sId',sId,
                               'date',DATE_FORMAT(sDate, "%d-%m-%Y"),
                               'qty',qty,
                               'note',note,
                               'status',updateStatus
                               )))) as result from stockupdate WHERE itemId=JSON_VALUE(request,'$.itemId');

END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1400001` (IN `request` JSON)   PRO: BEGIN
	  declare id int;
    declare stats int;
    declare i int;
    declare cnt int;
    declare cnt1 int;
    declare cmpData1 JSON;
    declare ratest int;
    declare mid int;
    DECLARE hid int;
    declare stas int;
    declare mrate decimal;
    SET SESSION group_concat_max_len = 1000000;
    set stas = 0;
    set id = JSON_VALUE(request,'$.cId');
    set stats = JSON_VALUE(request,'$.status');
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
			insert into renthistory(mId,itemId,qty,hDate,note,status,pending) VALUES(mid,json_value(cmpData1,'$.itemId'), json_value(cmpData1,'$.qty'),json_value(request,'$.date'),json_value(cmpData1,'$.note'),stats,json_value(cmpData1,'$.qty'));
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
			insert into renthistory(mId,itemId,qty,hDate,note,status,pending) VALUES(mid,json_value(cmpData1,'$.itemId'), json_value(cmpData1,'$.qty'),json_value(request,'$.date'),json_value(cmpData1,'$.note'),stats,1);
			set ratest = (select count(rId) from ratecard where cId = id and itemId = json_value(cmpData1,'$.itemId'));
            set hid = (select LAST_INSERT_ID());
			set ratest = (select count(rId) from ratecard where cId = id and itemId = json_value(cmpData1,'$.itemId'));
			SET  i = i + 1;
		END LOOP;
    call returnCalculate(id);
		select JSON_OBJECT("errorCode",1,"errorMsg","Inserted Successfully") as result;
    end if;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1400003` (IN `request` JSON)   BEGIN
	declare ststs int;
    declare qsty int;
    declare id int;
    SET SESSION group_concat_max_len = 1000000;
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


CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1400004` (IN `request` JSON)   BEGIN
    declare mhid int;
    SET SESSION group_concat_max_len = 1000000;
    set mhid = (select mId from renthistorymaster where mId = json_value(request,'$.mId'));
    if mhid is not null then
      DELETE from renthistorymaster where mId = json_value(request,'$.mId');
      select JSON_OBJECT("errorCode",1,"errorMsg","Delete Successfully") as result;
    else
      select JSON_OBJECT("errorCode",0,"errorMsg","Wrong mId") as result;
    end if;
END$$



CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1400005` (IN `request` JSON)   BEGIN
  SET SESSION group_concat_max_len = 1000000;
	select json_object("errorCode",1,"result",json_array(group_concat(json_object(
		'hId',rh.hId,
        'item',it.iName,
        'date',DATE_FORMAT(rh.hDate, "%d-%m-%Y"),
        'rate',rc.rate,
        'qty' ,rh.qty
    )))) as result from renthistory rh inner join renthistorymaster rhm on rhm.mId = rh.mId inner join items it on it.itemId = rh.itemId inner join ratecard rc on rc.itemId = it.itemId and rhm.cId = rc.cId where rh.mId = json_value(request,'$.mId');
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1400006` (IN `request` JSON)   BEGIN
	DECLARE masterData JSON;
    DECLARE datas JSON;
    DECLARE rnthsry JSON;
    DECLARE cnt int;
    declare pendingsum int;
    DECLARE i int;
    declare delStatus int;
    SET SESSION group_concat_max_len = 1000000;
    set masterData =
	(select concat('[',group_concat(json_object(
		    'mId',mId,
        'Date',cDate,
        'updateDate',updateDate,
        'status',status
    )ORDER BY mId),']') as result from renthistorymaster where cId = json_value(request,'$.cId')); 
    set datas = (select JSON_ARRAY());
    set cnt = IFNULL((select JSON_LENGTH(masterData)-1),-1);
    set i = 0;
    cmpinsert1:  LOOP
			IF  i > cnt THEN
				LEAVE  cmpinsert1;
			END IF;
            set rnthsry = json_extract(masterData, concat('$[',i,']'));
            set pendingsum = (select sum(pending) from renthistory where mId = JSON_VALUE(rnthsry,"$.mId"));
            set delStatus = IF((DATEDIFF(curdate(),JSON_VALUE(rnthsry,"$.updateDate"))) > 7,0,1);
            set datas = (select JSON_ARRAY_APPEND(datas, '$', JSON_OBJECT(
        "mId",cast(JSON_VALUE(rnthsry,"$.mId") as unsigned),
        "Date",DATE_FORMAT(JSON_VALUE(rnthsry,"$.Date"), "%d-%m-%Y"),
         "status",cast(JSON_VALUE(rnthsry,"$.status") as unsigned),
         "pending",IFNULL(cast(pendingsum as unsigned),0),
         "deleteStatus",delStatus
         )));
            set i=i+1;
     END LOOP;
    select JSON_OBJECT('errorCode',1,'result',datas) as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1500002` (IN `request` JSON)   BEGIN
    declare datas JSON;
    declare items JSON;
    declare cmpData JSON;
    declare cstatin int;
    declare cstatout int;
    declare pending int;
    declare cid int;
    declare j int;
    declare cct int;
    SET SESSION group_concat_max_len = 1000000;
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

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1500005` (IN `request` JSON)   BEGIN
	  declare items JSON;
    declare dates JSON;
    declare id int;
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
    SET SESSION group_concat_max_len = 1000000;
    set id = JSON_VALUE(request,'$.cId');
	set items = (select concat('[',GROUP_CONCAT(JSON_OBJECT('id',itemId,'name',iName)),']') from (select i.itemId as itemId, i.iName as iName from renthistory rh INNER JOIN renthistorymaster rhm on rh.mId = rhm.mId inner join items i on i.itemId = rh.itemId where rhm.cId = id GROUP BY i.itemId) as datatbl);
    
    set dates = (select concat('[',GROUP_CONCAT(JSON_OBJECT('date', hDate)),']') from (select distinct rh.hDate from renthistory rh inner join renthistorymaster rhm on rh.mId = rhm.mId where rhm.cId=id order by rh.hDate) as rh);
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
            set bdatas = (select JSON_ARRAY(DATE_FORMAT(JSON_VALUE(cmpData1,'$.date'), "%d-%m-%Y") ));
            set j=0;
            cmpip : LOOP
				IF  j > cct THEN
					LEAVE  cmpip;
				END IF;
                set cmpData2 = (select json_extract(items, concat('$[',j,']')));
				set bdata1 = (select JSON_OBJECT('hId',rh.hId,'itemId',rh.itemId,'qty',SUM(rh.qty),'status',rh.status) from renthistory rh inner join renthistorymaster rhm on rhm.mId = rh.mId  where rhm.cId = id and rh.hDate = JSON_VALUE(cmpData1,'$.date') and rh.itemId = JSON_VALUE(cmpData2,'$.id') and rh.status = 1 group by rh.hdate);
                if bdata1 is null then
					set bdata1 = JSON_OBJECT('hId',0,'itemId',JSON_VALUE(cmpData2,'$.id'),'qty',0,'status',1);
				end if;
                set bdata2 = (select JSON_OBJECT('hId',rh.hId,'itemId',rh.itemId,'qty',SUM(rh.qty),'status',rh.status) from renthistory rh inner join renthistorymaster rhm on rhm.mId = rh.mId  where rhm.cId = id and rh.hDate = JSON_VALUE(cmpData1,'$.date') and rh.itemId = JSON_VALUE(cmpData2,'$.id') and rh.status = 0 group by rh.hdate);
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

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1600002` (IN `request` JSON)   BEGIN
	DECLARE pric decimal(20,2);
    DECLARE unitp decimal(20,2);
    DECLARE dat date;
    declare days int;
    DECLARE cid int;
    DECLARE itemid int;
    DECLARE qtyy int;
    SET SESSION group_concat_max_len = 1000000;
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

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1600005` (IN `request` JSON)   BEGIN
  DECLARE sData JSON;
  DECLARE mData JSON;
  DECLARE err varchar(20);
  SET SESSION group_concat_max_len = 1000000;
  set sData = (SELECT JSON_ARRAY());
  set sData  = (select json_array(group_concat(json_object(
        'rId',0,
        'itemId',rh.itemId,
        'rentDate',DATE_FORMAT(rh.hDate, "%d-%m-%Y"),
        'returnDate',DATE_FORMAT(curdate(), "%d-%m-%Y"),
        'days',DATEDIFF(curdate(),rh.hDate),
        'qty',rh.pending,
        'price',getRentPrice (rh.itemId, rh.hDate, rhm.Cid, rh.pending),
        'status',0
    ))) from renthistory rh inner join renthistorymaster rhm on rh.mId = rhm.mId 
    where rhm.cId = json_value(request,'$.cId') and rh.ItemId = json_value(request,'$.itemId') and rh.status=1 and rh.pending != 0);
    set err = (select JSON_EXTRACT(sData,'$[0]'));
    if err = 'null' THEN
    	set sData = (SELECT JSON_ARRAY());
    end if;
  set mData = (SELECT JSON_ARRAY());
	set mData = (select json_array(group_concat(json_object(
		    'rId',rc.rId,
        'itemId',rc.itemid,
        'rentDate',DATE_FORMAT(rc.rentDate, "%d-%m-%Y"),
        'returnDate',DATE_FORMAT(rc.returnDate, "%d-%m-%Y"),
        'days',DATEDIFF(rc.returnDate,rc.rentDate),
        'qty',rc.qty,
        'price',rc.price,
        'status',1
    ))) from rentcalculations rc where rc.cId = json_value(request,'$.cId') AND rc.itemid= json_value(request,'$.itemId'));
    set err = (select JSON_EXTRACT(mData,'$[0]'));
    if err = 'null' THEN
    	set mData = (SELECT JSON_ARRAY());
    end if;
    select json_object("errorCode",1,"result",JSON_MERGE(sData,mData)) as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1600006` (IN `request` JSON)   BEGIN
  DECLARE sData DECIMAL(10,2);
  SET SESSION group_concat_max_len = 1000000;
  set sData  = (select SUM(IF(DATEDIFF(curdate(),rh.hDate)>30,(rate / 30)*rh.pending,0)) as rate
    from renthistory rh inner join renthistorymaster rhm on rh.mId = rhm.mId inner join ratecard rc on rhm.cId = rc.cId and rc.itemId = rh.itemId
    where rhm.cId = json_value(request,'$.cId') and rh.status=1 and rh.pending != 0);
    select JSON_OBJECT('data',sData) as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1700001` (IN `request` JSON)   BEGIN
 SET SESSION group_concat_max_len = 1000000;
	insert into paymentcollection(cId,pdate,amount) values(json_value(request,"$.cId"),json_value(request,"$.date"),json_value(request,"$.amount"));
    select JSON_OBJECT("errorCode",1,"result","Add successfully") as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1700002` (IN `request` JSON)   BEGIN
 SET SESSION group_concat_max_len = 1000000;
	update paymentcollection set amount = json_value(request,"$.amount") where pId = json_value(request,"$.pId");
    select JSON_OBJECT("errorCode",1,"result","Edit successfully") as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1700003` (IN `request` JSON)   BEGIN
	delete from paymentcollection where pId = json_value(request,"$.pId");
    select JSON_OBJECT("errorCode",1,"result","Delete successfully") as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1700005` (IN `request` JSON)   BEGIN
	  DECLARE datas JSON;
    DECLARE items JSON;
    DECLARE payments JSON;
    DECLARE rents JSON;
    DECLARE rentamounts JSON;
    DECLARE i int;
    DECLARE j int;
    DECLARE cnt int;
    DECLARE cct int;
    DECLARE amt decimal(10,2);
    DECLARE cmpData JSON;
    DECLARE cmpData1 JSON;
    DECLARE itemData JSON;
    DECLARE rentItems JSON;
    DECLARE itemsFinal JSON;
    DECLARE extra JSON;
    DECLARE total decimal(20,2);
    DECLARE paid decimal(20,2);
    SET SESSION group_concat_max_len = 1000000;
    set rentamounts = (select JSON_ARRAY());
    set rentItems = (select JSON_ARRAY());
    set itemsFinal = (select JSON_ARRAY());
    set rents = (select concat('[',GROUP_CONCAT(JSON_OBJECT("itemId",rh.itemId,"hDate",rh.hDate,"pending",rh.pending)),']') from renthistory rh inner join renthistorymaster rhm on rh.mId = rhm.mId where rhm.cId = JSON_VALUE(request,'$.cId') and rh.pending != 0 and rh.status = 1);
    set itemData = (select concat('[',GROUP_CONCAT(JSON_OBJECT('itemId',itemId,'itemName',iName)),']') from items );
    if rents is null or JSON_EXTRACT(rents,'$[0]') is null then
      set rents = (select JSON_ARRAY());
    end if;
    if itemData is null or JSON_VALUE(itemData,'$[0]') is null then
      set itemData = (select JSON_ARRAY());
    end if;
    set cnt = JSON_LENGTH(rents) - 1;
    set i = 0;
		cmpinsert:  LOOP
			IF  i > cnt THEN
				LEAVE  cmpinsert;
			END IF;
      set cmpData = (select json_extract(rents, concat('$[',i,']')));
      set rentamounts = (select JSON_ARRAY_APPEND(rentamounts, '$', JSON_OBJECT("itemId",JSON_VALUE(cmpData,'$.itemId'),"amount",getRentPrice(JSON_VALUE(cmpData,'$.itemId'),JSON_VALUE(cmpData,'$.hDate'),JSON_VALUE(request,'$.cId'),JSON_VALUE(cmpData,'$.pending')))));
      set i = i+1;
    END LOOP;
    set cnt = JSON_LENGTH(itemData) - 1;
    set cct = JSON_LENGTH(rentamounts) - 1;
    set i = 0;
		cmpinsert:  LOOP
			IF  i > cnt THEN
				LEAVE  cmpinsert;
			END IF;
      set cmpData = (select json_extract(itemData, concat('$[',i,']')));
       set j = 0;
       set amt = 0;
		    innerloop:  LOOP
			    IF  j > cct THEN
				    LEAVE  innerloop;
			    END IF;
          set cmpData1 = (select json_extract(rentamounts, concat('$[',j,']')));
          if JSON_VALUE(cmpData,"$.itemId") = JSON_VALUE(cmpData1,"$.itemId") then
            set amt = amt + JSON_VALUE(cmpData1,"$.amount");
          end if;
          set j= j+1;
        END LOOP;
        if amt > 0 then
          set rentItems = (select JSON_ARRAY_APPEND(rentItems,'$',JSON_OBJECT("itemId",JSON_VALUE(cmpData,"$.itemId"),"itemName",JSON_VALUE(cmpData,"$.itemName"),"amount",amt)));
        end if;
      set i = i+1;
    END LOOP;
    set datas = (SELECT JSON_ARRAY());
    set items = (select concat('[',GROUP_CONCAT(JSON_OBJECT("itemId",itemId,"itemName",itemName,"amount",amount)),']') from (select i.itemId,i.iName as itemName ,SUM(rc.price) as amount from rentcalculations rc inner join items i on rc.itemid = i.itemId where cId=JSON_VALUE(request,"$.cId") group by rc.itemid) as calc);
    if items is null or JSON_EXTRACT(items,'$[0]') is null then
      set items = (select JSON_ARRAY());
    end if;
    set cnt = JSON_LENGTH(rentItems) - 1;
    set cct = JSON_LENGTH(items) - 1;
    set i = 0;
    if cnt >= cct then
		  cmpinsert:  LOOP
			  IF  i > cnt THEN
				  LEAVE  cmpinsert;
			  END IF;
        set cmpData = (select json_extract(rentItems, concat('$[',i,']')));
        set j = 0;
        set cct = JSON_LENGTH(items) - 1;
        set amt = 0;
		      innerloop:  LOOP
			      IF  j > cct THEN
				      LEAVE  innerloop;
			      END IF;
            set cmpData1 = (select json_extract(items, concat('$[',j,']')));
            if JSON_VALUE(cmpData,"$.itemId") = JSON_VALUE(cmpData1,"$.itemId") then
              set amt = JSON_VALUE(cmpData,"$.amount") + JSON_VALUE(cmpData1,"$.amount");
              set itemsFinal = (select JSON_ARRAY_APPEND(itemsFinal,'$',JSON_OBJECT("itemId",JSON_VALUE(cmpData,"$.itemId"),"itemName",JSON_VALUE(cmpData,"$.itemName"),"amount",amt)));
              set items = (select JSON_REMOVE(items, concat('$[',j,']')));
              LEAVE  innerloop;
            end if;
            set j = j+1;
            END LOOP;
            if amt = 0 then
              set itemsFinal = (select JSON_ARRAY_APPEND(itemsFinal,'$',cmpData));
            end if;
        set i = i+1;
      END LOOP;
      set itemsFinal = (select JSON_MERGE(itemsFinal,items));
    else
      cmpinsert:  LOOP
			  IF  i > cct THEN
				  LEAVE  cmpinsert;
			  END IF;
        set cmpData = (select json_extract(items, concat('$[',i,']')));
        set j = 0;
        set cnt = JSON_LENGTH(rentItems) - 1;
        set amt = 0;
		      innerloop:  LOOP
			      IF  j > cnt THEN
				      LEAVE  innerloop;
			      END IF;
            set cmpData1 = (select json_extract(rentItems, concat('$[',j,']')));
            if JSON_VALUE(cmpData,"$.itemId") = JSON_VALUE(cmpData1,"$.itemId") then
              set amt = JSON_VALUE(cmpData,"$.amount") + JSON_VALUE(cmpData1,"$.amount");
              set itemsFinal = (select JSON_ARRAY_APPEND(itemsFinal,'$',JSON_OBJECT("itemId",JSON_VALUE(cmpData,"$.itemId"),"itemName",JSON_VALUE(cmpData,"$.itemName"),"amount",amt)));
              set rentItems = (select JSON_REMOVE(rentItems, concat('$[',j,']')));
              LEAVE  innerloop;
            end if;
            set j = j+1;
            END LOOP;
            if amt = 0 then
              set itemsFinal = (select JSON_ARRAY_APPEND(itemsFinal,'$',cmpData));
            end if;
        set i = i+1;
      END LOOP;
      set itemsFinal = (select JSON_MERGE(itemsFinal,rentItems));
    end if;

    set cct = JSON_LENGTH(itemsFinal) - 1;
    set i = 0;
    set total = 0;
		cmpinsert:  LOOP
			IF  i > cct THEN
				LEAVE  cmpinsert;
			END IF;
      set cmpData1 = (select json_extract(itemsFinal, concat('$[',i,']')));
      set total = total + JSON_VALUE(cmpData1,"$.amount");
      set i = i+1;
    END LOOP;

    set cmpData = (select concat('[',GROUP_CONCAT(JSON_OBJECT("amount",amount,"status",status)),']')  from extrapayment where cId = JSON_VALUE(request,"$.cId"));
    if cmpData is null then
      set cmpData = (select JSON_ARRAY());
    end if;

    set cct = JSON_LENGTH(cmpData) - 1;
    set i = 0;
		cmpinsert:  LOOP
			IF  i > cct THEN
				LEAVE  cmpinsert;
			END IF;
      set cmpData1 = (select json_extract(cmpData, concat('$[',i,']')));
      if JSON_VALUE(cmpData1,"$.status") = 1 then
        set total = total + JSON_VALUE(cmpData1,"$.amount");
      else 
        set total = total - JSON_VALUE(cmpData1,"$.amount");
      end if;
      set i = i+1;
    END LOOP;
    set paid = (select sum(amount) from paymentcollection where cId = json_value(request,"$.cId"));
    if itemsFinal is null or JSON_VALUE(itemsFinal,'$[0]') is null then
      set itemsFinal = (select JSON_ARRAY());
    end if;
    set datas = (select JSON_ARRAY_APPEND(datas, '$', itemsFinal));
    set payments = (select JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT("pId",pId,"date",DATE_FORMAT(pDate, "%d-%m-%Y"),"amount",amount))) from paymentcollection where cId = JSON_VALUE(request,"$.cId"));
    if payments is null or JSON_VALUE(payments,'$[0]') is null then
      set payments = (select JSON_ARRAY());
    end if;
    set datas = (select JSON_ARRAY_APPEND(datas, '$', payments));
    set extra = (select JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT("expId",expId,"date",DATE_FORMAT(date, "%d-%m-%Y"),"amount",amount,"note",note,"status",status))) from extrapayment where cId = JSON_VALUE(request,"$.cId"));
    if extra is null or JSON_VALUE(extra,'$[0]') is null then
      set extra = (select JSON_ARRAY());
    end if;
    set datas = (select JSON_ARRAY_APPEND(datas, '$', extra));
    select JSON_OBJECT("errorCode",1,"result",datas,"items",JSON_OBJECT("items",total,"paid",paid)) as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1700006` (IN `request` JSON)   BEGIN
	insert into extrapayment(cId,amount,date,note,status) values(json_value(request,"$.cId"),json_value(request,"$.amount"),json_value(request,"$.date"),json_value(request,"$.note"),json_value(request,"$.status"));
  select JSON_OBJECT("errorCode",1,"result","Add successfully") as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1700007` (IN `request` JSON)   BEGIN
	update extrapayment set amount = json_value(request,"$.amount"),date=json_value(request,"$.date"),note=json_value(request,"$.note"),status=json_value(request,"$.status") where expId = json_value(request,"$.expId");
  select JSON_OBJECT("errorCode",1,"result","Edit successfully") as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1700008` (IN `request` JSON)   BEGIN
	delete from extrapayment where expId = json_value(request,"$.expId");
  select JSON_OBJECT("errorCode",1,"result","Delete successfully") as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1700010` (IN `request` JSON)   BEGIN
	DECLARE datas JSON;
   SET SESSION group_concat_max_len = 1000000;
    set datas = (select JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT("expId",expId,"date",date,"amount",amount,"note",note,"status",status))) from extrapayment where cId = JSON_VALUE(request,"$.cId"));
    select JSON_OBJECT("errorCode",1,"result",datas) as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1800002` (IN `request` JSON)   BEGIN
	UPDATE ratecard set rate = JSON_VALUE(request,'$.rate') where rId = JSON_VALUE(request,'$.rId');
  select JSON_OBJECT("errorCode",1,"errorMsg","Updated Successfully") as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `1800005` (IN `request` JSON)   BEGIN
 SET SESSION group_concat_max_len = 1000000;
	SELECT JSON_OBJECT("errorCode",1,"result",JSON_ARRAY(
    GROUP_CONCAT(
    	JSON_OBJECT(
        "rId",rc.rId,
        "rate",rc.rate,
        "itemName",i.iName
        )
    ))) as result FROM ratecard rc INNER JOIN items i on i.itemId = rc.itemId where rc.cId = JSON_VALUE(request,'$.cId');
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `2300005` (IN `request` JSON)   BEGIN
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
     SET SESSION group_concat_max_len = 1000000;
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

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `2300006` (IN `request` JSON)   BEGIN
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
     SET SESSION group_concat_max_len = 10000000;
     SET SESSION max_execution_time=20000;
     SET session wait_timeout=600;
    set itemData = JSON_VALUE(request,'$.items') ;
        if JSON_LENGTH(itemData) = 0  or itemData is null then 
              set itemData = (select concat('[',GROUP_CONCAT(JSON_OBJECT('itemId',itemId,'itemName',iName)),']') from items );
        end if;
    set customerData = (select concat('[',GROUP_CONCAT(JSON_OBJECT('cId',`cId`,'name',`cName`,'Phone',`mobile`) ORDER BY cName ASC),']') from customermaster where status = 0);

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
                          set fdata = (select JSON_ARRAY_APPEND(fdata,'$',JSON_OBJECT('pending', IF(pendingStock = 0, '', pendingStock))));
                          set j=j+1;
                    END LOOP;
                    -- set fdata = (select JSON_ARRAY_APPEND(fdata,'$',JSON_OBJECT('pending',getPendingAmount(JSON_VALUE(id,'$.cId')))));
                    set datas = (select JSON_ARRAY_APPEND(datas,'$',(select JSON_ARRAY_APPEND(fdata,'$',JSON_OBJECT('pending',getPendingAmount(JSON_VALUE(id,'$.cId')))))));
                    if activeCust = 0 then
                      if getPendingAmount(JSON_VALUE(id,'$.cId')) = 0 then
                        set datas = (select JSON_REMOVE(datas,concat('$[',JSON_LENGTH(datas)-1,']')));
                      end if;
                    end if;
        set i = i+1;
    END LOOP;
    set label =(select JSON_ARRAY_APPEND(label,'$','PendingAmount'));
    if cnt = -1 THEN
     set label =(select JSON_ARRAY());
    end if;
    select JSON_OBJECT('errorCode',1,'result',JSON_OBJECT('label',label,'data',datas)) as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `2300007` (IN `request` JSON)   BEGIN	DECLARE date1 date;
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
         SET SESSION group_concat_max_len = 1000000;
        set sts = 0;

        set date1 = IFNULL(JSON_VALUE(request,'$.from'),0);
        set date2 = IFNULL(JSON_VALUE(request,'$.to'),0);
        

        set dates =
        (
            select concat('[',GROUP_CONCAT(JSON_OBJECT('hDate',hDate) order by hDate),']') 
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

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `2300008` (IN `request` JSON)   BEGIN
	  DECLARE dates JSON;
    DECLARE date1 JSON;
    DECLARE items JSON; 
    DECLARE item1 JSON;
    DEClARE data1 JSON;
    DEClARE datas JSON;
    DEClARE fdatas JSON;
    DEClARE j int;
    DEClARE i int;
    DECLARE jcnt int;
    DECLARE icnt int;
    DEClARE sts int;
     SET SESSION group_concat_max_len = 1000000;
    set fdatas = (select JSON_ARRAY());
    set dates = (select concat('[',GROUP_CONCAT(json_object('hDate',hDate) order by hDate),']') from (select distinct hDate from renthistory rh inner join renthistorymaster rhm where rhm.cId = JSON_VALUE(request, '$.cId')) as indus);
    set items = (select concat('[',GROUP_CONCAT(json_object('itemId',itemId,'itemName',iName)),']') from (select distinct rh.itemId,i.iName from renthistory rh inner join renthistorymaster rhm inner join items i on i.itemId = rh.itemId where rhm.cId = JSON_VALUE(request, '$.cId')) as indus);
    if dates is null then
      set dates = (select JSON_ARRAY());
    end if;
    if items is null then
      set items = (select JSON_ARRAY());
    end if;
    set jcnt = JSON_LENGTH(dates)-1;
    set icnt = JSON_LENGTH(items)-1;
    set j = 0;
    outerloop : LOOP
        IF j > jcnt THEN
           LEAVE outerloop;
        END IF;
        set date1 = (select json_extract(dates, concat('$[',j,']')));
        set i=0;
        set datas = (select JSON_ARRAY());
        set datas = (select JSON_ARRAY_APPEND(datas,'$',DATE_FORMAT(JSON_VALUE(date1, '$.hDate'), "%d-%m-%Y")));
        set sts = 0;
        innerloop : LOOP
          IF i > icnt THEN
            LEAVE innerloop;
          END IF;
          set item1 = (select json_extract(items, concat('$[',i,']')));
          set data1 = (select concat('[',GROUP_CONCAT(JSON_OBJECT('note',rh.note,'status',rh.status)),']') from renthistory rh inner join renthistorymaster rhm on rh.mId = rhm.mId where rhm.cId = JSON_VALUE(request, '$.cId') and rh.hDate = JSON_VALUE(date1, '$.hDate') and rh.itemId = JSON_VALUE(item1, '$.itemId') and rh.note != "" and rh.note is not null);
          if data1 is not null then
            set sts = 1;
            set datas = (select JSON_ARRAY_APPEND(datas,'$',data1));
          else
            set datas = (select JSON_ARRAY_APPEND(datas,'$',JSON_ARRAY(JSON_OBJECT('note',"",'status',0))));
          end if;
          set i= i+1;
        END LOOP;
        if sts = 1 then 
          set fdatas = (select JSON_ARRAY_APPEND(fdatas,'$',datas));
        end if;
        set j = j+1;
    END LOOP;
    select JSON_OBJECT('errorCode',1,'result',JSON_OBJECT('label',items,'data',fdatas)) as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `2300010` (IN `request` JSON)   BEGIN
	  DECLARE stockUpdates JSON;
    DECLARE stock1 JSON;
    DECLARE items JSON; 
    DECLARE item1 JSON;
    DEClARE data1 JSON;
    DEClARE datas JSON;
    DEClARE fdatas JSON;
    DEClARE label JSON;
    DEClARE j int;
    DEClARE i int;
    DECLARE jcnt int;
    DECLARE icnt int;
    SET SESSION group_concat_max_len = 1000000;
    set label = (SELECT JSON_MERGE((select JSON_ARRAY("DATE")),(select JSON_ARRAY(GROUP_CONCAT(iName SEPARATOR '","')) from items))) ;
    set items = (select concat('[',GROUP_CONCAT(json_object('itemId',itemId,'itemName',iName)),']') from items);
    set stockUpdates = (select concat('[',GROUP_CONCAT(json_object('dsmId',dsmId,'date',date)),']') from dailyStockMaster order by date DESC);
    if label is null then
      set label = (select JSON_ARRAY());
    end if;
    if items is null then
      set items = (select JSON_ARRAY());
    end if;
    if stockUpdates is null then
      set stockUpdates = (select JSON_ARRAY());
    end if;
    set jcnt = JSON_LENGTH(stockUpdates)-1;
    set icnt = JSON_LENGTH(items)-1;
    set datas = (select JSON_ARRAY());
    set j = 0;
      outerloop : LOOP
        IF j > jcnt THEN
           LEAVE outerloop;
        END IF;
        set stock1 = (select json_extract(stockUpdates, concat('$[',j,']')));
        set i=0;
        set fDatas = (select JSON_OBJECT("DATE",DATE_FORMAT(JSON_VALUE(stock1, '$.date'), "%d-%m-%Y")));
        innerloop : LOOP
          IF i > icnt THEN
            LEAVE innerloop;
          END IF;
          set item1 = (select json_extract(items, concat('$[',i,']')));
          set data1 = (select JSON_OBJECT(i.iName,dsc.Stock)  from dailyStockChild dsc inner join items i on i.itemId = dsc.itemId where dsc.itemId = JSON_VALUE(item1, '$.itemId') and dsc.dsmId = JSON_VALUE(stock1, '$.dsmId'));
          set fDatas = (select JSON_MERGE(fDatas,data1));
          set i= i+1;
        END LOOP;
        set datas = (select JSON_ARRAY_APPEND(datas,'$',fDatas));
        set j = j+1;
    END LOOP;
    select JSON_OBJECT('errorCode',1,'result',json_object("label",label,"data",datas)) as result;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `newrentcalculation` (IN `item` INT(10), IN `dat` DATE, IN `redat` DATE, IN `id` INT(10), IN `qtyy` INT(10))   BEGIN
	DECLARE pric decimal(20,2);
    DECLARE unitp decimal(20,2);
    declare days int;
     SET SESSION group_concat_max_len = 1000000;
    set unitp = (select rate from ratecard where itemId = item and cId =id  limit 1);
    set days = DATEDIFF(redat, dat);
    if days > 30 then
    	set pric = (unitp + (days - 30) * (unitp /30)) * qtyy;
    else
    	set pric = unitp * qtyy;
    end if;
    insert into rentcalculations(itemId,rentDate,returnDate,cId,price,qty) values(item,dat,redat,id,pric,qtyy);
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `returnCalculate` (IN `id` INT)   BEGIN
	 DECLARE pqty int;
    DECLARE qty1 int;
    DECLARE iId int;
    declare rnthsry JSON;
    declare rnthsry1 JSON;
    DECLARE datas JSON;
    DECLARE cnt int;
    DECLARE i int;
     SET SESSION group_concat_max_len = 1000000;
    set rnthsry = (select concat("[",GROUP_CONCAT(JSON_OBJECT("hId",rh.hId,"hDate",rh.hDate)),"]") from renthistory rh inner join renthistorymaster rhm on rh.mId = rhm.mId where rhm.cId = id and rh.status=0 and rh.pending!=0);
    if rnthsry is null then
		  set rnthsry = (select JSON_ARRAY());
	  end if;
    set i=0;
    set cnt = (select JSON_LENGTH(rnthsry)-1);
    cmpinsert1:  LOOP
			IF  i > cnt THEN
				LEAVE  cmpinsert1;
			END IF;
			set rnthsry1 = json_extract(rnthsry, concat('$[',i,']'));
            set pqty = (select renthistory.qty from renthistory where hId = JSON_VALUE(rnthsry1,'$.hId'));
			  set iId = (select renthistory.itemId from renthistory where hId = JSON_VALUE(rnthsry1,'$.hId'));
			cmpip : LOOP
				IF  pqty = 0 THEN
					LEAVE  cmpip;
				END IF;
                set qty1 = (select rh.pending from renthistory rh inner join renthistorymaster rhm on rh.mId = rhm.mId where rh.itemId = iId and rh.status = 1 and rh.pending != 0 and rhm.cId = id order by rh.hId LIMIT 1);
                set datas = (select JSON_OBJECT("hId", rh.hId,"date",rh.hDate) from renthistory rh inner join renthistorymaster rhm on rh.mId = rhm.mId where rh.itemId = iId and rh.status = 1 and rh.pending != 0 and rhm.cId = id order by rh.hId LIMIT 1);
				if JSON_VALUE(datas,'$.date') is null then
            LEAVE  cmpinsert1;
        end if;
        if pqty < qty1 THEN
					update renthistory set pending = pending - pqty where hId = JSON_VALUE(datas,'$.hId');
					call newrentcalculation(iId,JSON_VALUE(datas,'$.date'),JSON_VALUE(rnthsry1,'$.hDate'),id,pqty);
					set pqty = 0;
				else
					update renthistory set pending = 0 where hId = JSON_VALUE(datas,'$.hId');
					call newrentcalculation(iId,JSON_VALUE(datas,'$.date'),JSON_VALUE(rnthsry1,'$.hDate'),id,qty1);
					set pqty = pqty - qty1;
				end if;
        END LOOP;
            update renthistory set pending = 0 where hId = JSON_VALUE(rnthsry1,'$.hId');
            set i= i+1;
     END LOOP;
END$$


CREATE DEFINER=`aonerent_admin`@`localhost` PROCEDURE `dailyStockEnter` ()   BEGIN
	DECLARE itemData JSON;
	DECLARE items JSON;
	DECLARE fdata JSON;
	DECLARE i int;
	DECLARE icnt int;
	DECLARE aStock int;
	DECLARE rentStock int;
	DECLARE returnStock int;
	DECLARE pStock int;
  DECLARE dsId int;

  INSERT INTO dailyStockMaster VALUES();
  set dsId = (SELECT LAST_INSERT_ID());
   SET SESSION group_concat_max_len = 1000000;
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
        INSERT INTO dailyStockChild(dsmId,itemId,Stock) VALUES(dsId,JSON_VALUE(items,'$.itemId'),aStock);
		set i = i+1;
		END LOOP;
END$$

--
-- Functions
--
CREATE DEFINER=`aonerent_admin`@`localhost` FUNCTION `getPendingAmount` (`id` INT(10)) RETURNS DECIMAL(20,2)  BEGIN
	DECLARE sData JSON;
  DECLARE mData JSON;
  DECLARE fData JSON;
  DECLARE total decimal(20,2);
  DECLARE iprice decimal(20,2);
  DECLARE oprice decimal(20,2);
  DECLARE err varchar(20);
  DECLARE i int;
  DECLARE cnt int;
   SET SESSION group_concat_max_len = 1000000;
  set sData  = (select concat('[',group_concat(json_object('price',getRentPrice(rh.itemId, rh.hDate, rhm.cId, rh.pending))),']') 
    from renthistory rh inner join renthistorymaster rhm on rh.mId = rhm.mId 
    where rhm.cId = id and rh.status=1 and rh.pending != 0);
    set err = (select JSON_EXTRACT(sData,'$[0]'));
    if err = 'null' OR err is null THEN
    	set sData = (SELECT JSON_ARRAY());
    end if;
  set mData = (SELECT JSON_ARRAY());
	set mData = (select concat('[',group_concat(json_object('price',rc.price)),']') 
  from rentcalculations rc where rc.cId = id);
    set err = (select JSON_EXTRACT(mData,'$[0]'));
    if err = 'null' OR err is null THEN
    	set mData = (SELECT JSON_ARRAY());
    end if;
    set fData = (select JSON_MERGE(sData,mData));
    set i=0;
    set cnt = (select JSON_LENGTH(fData)-1);
    set total = 0;
    cmpinsert1:  LOOP
			IF  i > cnt THEN
				LEAVE  cmpinsert1;
			END IF;
      set sData = json_extract(fData, concat('$[',i,']'));
      set iprice = JSON_VALUE(sData,'$.price');
      set total = total + iprice;
      set i = i+1;
    END LOOP;
    set iprice = (select sum(amount) from extrapayment where cId = id and status = 1);
    set total = total + IFNULL(iprice,0);
    set oprice = (select sum(amount) from extrapayment where cId = id and status = 0);
    set total = total - IFNULL(oprice,0);
    set oprice = (select sum(amount) from paymentcollection where cId = id );
    set total = total - IFNULL(oprice,0);
    Return total;
END$$

CREATE DEFINER=`aonerent_admin`@`localhost` FUNCTION `getRentPrice` (`item` INT(10), `dat` DATE, `id` INT(10), `qtyy` INT(10)) RETURNS DECIMAL(20,2)  BEGIN
	DECLARE pric decimal(20,2);
    DECLARE unitp decimal(20,2);
    declare days int;
     SET SESSION group_concat_max_len = 1000000;
    set unitp = (select rate from ratecard where itemId = item and cId =id  limit 1);
    set days = DATEDIFF(CURDATE(), dat);
    if days > 30 then
    	set pric = (unitp + (days - 30) * (unitp /30)) * qtyy;
    else
    	set pric = unitp * qtyy;
    end if;
    Return pric; 
END$$

--
-- Events
--

CREATE DEFINER=`aonerent_admin`@`localhost` EVENT `Stock Updation` 
ON SCHEDULE EVERY 1 DAY STARTS '2024-01-28 00:00:00' 
ON COMPLETION NOT PRESERVE ENABLE 
  COMMENT 'add last daily stocks' 
  DO CALL `dailyStockEnter`();

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `customermaster`
--

CREATE TABLE `customermaster` (
  `cId` int NOT NULL,
  `cName` varchar(70) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `alterMobile` varchar(20) DEFAULT NULL,
  `address` varchar(150) DEFAULT NULL,
  `proof` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `coName` varchar(50) DEFAULT NULL,
  `coMobile` varchar(20) DEFAULT NULL,
  `status` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `customermaster`
--

INSERT INTO `customermaster` (`cId`, `cName`, `mobile`, `alterMobile`, `address`, `proof`, `coName`, `coMobile`, `status`) VALUES
(1034, 'Muhammmed Yaseen', '8714914848', NULL, NULL, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `dId` int NOT NULL,
  `cId` int NOT NULL,
  `file` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `extrapayment`
--

CREATE TABLE `extrapayment` (
  `expId` int NOT NULL,
  `cId` int NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `date` date NOT NULL,
  `note` varchar(500) NOT NULL,
  `status` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `extrapayment`
--

INSERT INTO `extrapayment` (`expId`, `cId`, `amount`, `date`, `note`, `status`) VALUES
(1, 1034, 4005.00, '2023-07-24', 'notes', 0),
(2, 1034, 500.00, '2023-07-23', 'home rent', 1),
(4, 1034, 999.00, '2023-07-25', 'home rent', 1),
(5, 1034, 500.00, '2023-07-24', 'home rent', 1),
(6, 1034, 999.00, '2023-07-10', 'fdfas', 1),
(7, 1034, 100.00, '2023-07-25', 'minuse', 0);

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `itemId` int NOT NULL,
  `iName` varchar(60) DEFAULT NULL,
  `mRent` decimal(10,2) DEFAULT NULL,
  `tStock` int DEFAULT NULL,
  `status` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`itemId`, `iName`, `mRent`, `tStock`, `status`) VALUES
(1, 'Sheet', 240.00, 322, 1),
(2, 'ladder', 15000.00, 30, 0);

-- --------------------------------------------------------

--
-- Table structure for table `login_session`
--

CREATE TABLE `login_session` (
  `sId` int NOT NULL,
  `uId` int DEFAULT NULL,
  `token` text,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `platform` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `login_session`
--

INSERT INTO `login_session` (`sId`, `uId`, `token`, `time`, `platform`) VALUES
(1, 1, '123', '2023-07-21 05:44:41', 'windows'),
(2, 1, 'fff65e27bd335d1d3fbd1419d7e8af5b', '2023-07-24 12:07:23', 'desktop/Windows'),
(3, 1, '063f83894b5cc0500f5b9ec301a076ea', '2023-07-25 15:22:08', 'desktop/Windows'),
(4, 2, 'fe7eedfc7c9e61715d8087ed4e3338a2', '2023-07-27 08:32:34', 'desktop/Windows'),
(5, 1, 'd4d2b3009dcd00e078d99891df0c90d7', '2023-07-27 08:35:42', 'desktop/Windows'),
(6, 2, '3d09ef80e5cd2e7af30c4cb014c0c144', '2023-07-27 08:36:12', 'desktop/Windows'),
(7, 1, '18c59b998e373d5319c3745b893760cf', '2023-07-27 08:42:34', 'desktop/Windows'),
(8, 2, '88080f846e625b2f94b7ff36539b66ae', '2023-07-27 08:53:03', 'desktop/Windows'),
(9, 1, '8aacf99d24c6d9746510322d0f38306f', '2023-07-27 09:13:20', 'desktop/Windows');

-- --------------------------------------------------------

--
-- Table structure for table `paymentcollection`
--

CREATE TABLE `paymentcollection` (
  `pId` int NOT NULL,
  `cId` int DEFAULT NULL,
  `pDate` date DEFAULT NULL,
  `amount` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `paymentcollection`
--

INSERT INTO `paymentcollection` (`pId`, `cId`, `pDate`, `amount`) VALUES
(1, 1034, NULL, 500);

-- --------------------------------------------------------

--
-- Table structure for table `ratecard`
--

CREATE TABLE `ratecard` (
  `rId` int NOT NULL,
  `itemId` int DEFAULT NULL,
  `cId` int DEFAULT NULL,
  `rate` decimal(10,2) DEFAULT NULL,
  `status` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `ratecard`
--

INSERT INTO `ratecard` (`rId`, `itemId`, `cId`, `rate`, `status`) VALUES
(2, 1, 1034, 240.00, 1),
(3, 2, 1034, 15000.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `rentcalculations`
--

CREATE TABLE `rentcalculations` (
  `rId` int NOT NULL,
  `itemid` int DEFAULT NULL,
  `rentDate` date DEFAULT NULL,
  `returnDate` date DEFAULT NULL,
  `cId` int DEFAULT NULL,
  `price` decimal(20,2) DEFAULT NULL,
  `qty` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `renthistory`
--

CREATE TABLE `renthistory` (
  `hId` int NOT NULL,
  `mId` int DEFAULT NULL,
  `itemId` int DEFAULT NULL,
  `qty` int DEFAULT NULL,
  `hDate` date DEFAULT NULL,
  `note` varchar(500) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `pending` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `renthistory`
--

INSERT INTO `renthistory` (`hId`, `mId`, `itemId`, `qty`, `hDate`, `note`, `status`, `pending`) VALUES
(2, 2, 1, 1, '2023-07-17', '', 1, 1),
(3, 3, 1, 1, '2023-07-17', 'uytytr', 1, 1),
(4, 4, 1, 1, '2023-07-23', 'ddf', 1, 1),
(5, 5, 2, 1, '2023-07-23', 'ladder', 1, 1),
(6, 6, 1, 1, '2023-07-25', 'aasdfas', 1, 1),
(7, 7, 1, 1, '2023-07-25', 'asdfasdf', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `renthistorymaster`
--

CREATE TABLE `renthistorymaster` (
  `mId` int NOT NULL,
  `cDate` date DEFAULT NULL,
  `cId` int DEFAULT NULL,
  `status` int DEFAULT NULL,
  `updateDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `renthistorymaster`
--

INSERT INTO `renthistorymaster` (`mId`, `cDate`, `cId`, `status`) VALUES
(2, '2023-07-17', 1034, 1),
(3, '2023-07-17', 1034, 1),
(4, '2023-07-23', 1034, 1),
(5, '2023-07-23', 1034, 1),
(6, '2023-07-25', 1034, 1),
(7, '2023-07-25', 1034, 1),
(12, '2023-07-27', 1034, 0),
(13, '2023-07-27', 1034, 0),
(14, '2023-07-27', 1034, 0),
(15, '2023-07-27', 1034, 0),
(16, '2023-07-08', 1034, 0),
(17, '2023-07-08', 1034, 0),
(18, '2023-07-08', 1034, 0);

-- --------------------------------------------------------

--
-- Table structure for table `stockupdate`
--

CREATE TABLE `stockupdate` (
  `sId` int NOT NULL,
  `sDate` date DEFAULT NULL,
  `qty` int DEFAULT NULL,
  `note` varchar(500) NOT NULL,
  `itemId` int DEFAULT NULL,
  `updateStatus` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `stockupdate`
--

INSERT INTO `stockupdate` (`sId`, `sDate`, `qty`, `note`, `itemId`, `updateStatus`) VALUES
(1, '2023-07-27', 25, '25', 1, 1),
(2, '2023-07-27', 45, '45', 1, 1),
(3, '2023-07-27', 32, '32', 1, 1),
(4, '2023-07-27', 20, 'asfd', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uId` int NOT NULL,
  `userName` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `userType` varchar(30) DEFAULT NULL,
  `status` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uId`, `userName`, `password`, `userType`, `status`) VALUES
(1, 'admin@123.com', '21232f297a57a5a743894a0e4a801fc3', 'admin', 1),
(2, 'owner@123.com', 'f2744d74ae037d1766ab076c4b66d315', 'owner', 1),
(3, 'yaseen', '25d55ad283aa400af464c76d713c07ad', 'admin', 0);

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
-- Indexes for table `extrapayment`
--
ALTER TABLE `extrapayment`
  ADD PRIMARY KEY (`expId`);

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
  MODIFY `cId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1000;

--
-- AUTO_INCREMENT for table `document`
--
ALTER TABLE `document`
  MODIFY `dId` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `extrapayment`
--
ALTER TABLE `extrapayment`
  MODIFY `expId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `itemId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `login_session`
--
ALTER TABLE `login_session`
  MODIFY `sId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `paymentcollection`
--
ALTER TABLE `paymentcollection`
  MODIFY `pId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `ratecard`
--
ALTER TABLE `ratecard`
  MODIFY `rId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `rentcalculations`
--
ALTER TABLE `rentcalculations`
  MODIFY `rId` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `renthistory`
--
ALTER TABLE `renthistory`
  MODIFY `hId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `renthistorymaster`
--
ALTER TABLE `renthistorymaster`
  MODIFY `mId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `stockupdate`
--
ALTER TABLE `stockupdate`
  MODIFY `sId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `renthistory`
--
ALTER TABLE `renthistory`
  ADD CONSTRAINT `renthistory_ibfk_1` FOREIGN KEY (`mId`) REFERENCES `renthistorymaster` (`mId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `renthistorymaster `
--

ALTER TABLE `renthistorymaster`
  ADD CONSTRAINT `renthistorymaster_ibfk_1` FOREIGN KEY (`cId`) REFERENCES `customermaster` (`cId`) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
