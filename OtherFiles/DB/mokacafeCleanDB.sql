-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 31, 2015 at 08:28 PM
-- Server version: 5.5.24-log
-- PHP Version: 5.4.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `mokacafetest`
--

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `add_acc_mov`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_acc_mov`(mov_dat date,mov_time time,mov_type int,sales_table tinyint,cust_table tinyint,cash_table tinyint,purch_table tinyint,exp_table tinyint,staff_table tinyint,othincome_table tinyint)
BEGIN
INSERT INTO `acc_mov` (`acc_mov_id`, `mov_dat`, `mov_time`, `mov_timestamp`, `mov_type`, `sales_table`, `cust_table`, `cash_table`, `purch_table`, `exp_table`, `staff_table`, `othincome_table`) VALUES (NULL, mov_dat, mov_time, CURRENT_TIMESTAMP, mov_type, sales_table, cust_table, cash_table, purch_table, exp_table, staff_table, othincome_table);
SELECT LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS `add_cash_mov`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_cash_mov`(acc_mov_id int,cash_dat date, cash_time time,acc_mov_type int,cash_openbalance float,cash_value float,cash_endbalance float,cash_desc text)
BEGIN
INSERT INTO `acc_cash` (`cash_id`, `acc_mov_id`, `cash_dat`, `cash_time`, `cash_timestamp`, `acc_mov_type`, `cash_openbalance`, `cash_value`, `cash_endbalance`, `cash_desc`) VALUES (NULL, acc_mov_id, cash_dat,cash_time ,CURRENT_TIMESTAMP, acc_mov_type, cash_openbalance, cash_value, cash_endbalance, cash_desc);
SELECT LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS `add_expences_process`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_expences_process`(IN `exptype` INT, IN `exp_code` INT, IN `exp_dat` DATE, IN `exp_time` TIME, IN `exp_value` FLOAT, IN `exp_desc` LONGTEXT CHARSET utf8, IN `fromcash` INT, IN `profid` INT, IN `issalary` INT)
BEGIN
/*expenses process*/
/*if expense is salaries or payto partner  exptype=1*/
IF exptype=1 THEN
/*if type is salary or paid to partner from the cashier*/
IF fromcash=10000 THEN
/*0- add acc movment, 1- update cash ,2-update the acc profile,3- update expenses */
CALL `add_acc_mov`(exp_dat,exp_time,3,0,0,1,0,1,1,0);
SET @accmov_id = LAST_INSERT_ID();
/*update cash*/
CALL `add_cash_mov` (@accmov_id,exp_dat,exp_time,2,0,exp_value,0,exp_desc);
/*update acc prof*/
INSERT INTO `acc_mov_profiles` (`acc_prof_mov_id`, `acc_mov_id`, `prof_mov_dat`, `prof_mov_time`, `prof_mov_timestamp`, `prof_id`, `acc_mov_type`, `prof_mov_value`, `prof_mov_balance`, `prof_mov_desc`, `salary`) VALUES (NULL, @accmov_id, exp_dat,exp_time ,CURRENT_TIMESTAMP, profid, 2, exp_value, 0, exp_desc,issalary);
/*update expences tbl*/
INSERT INTO `acc_expenses` (`exp_id`, `acc_mov_id`, `exp_code`, `exp_dat`, `exp_time`, `exp_timestamp`, `exp_value`, `exp_desc`, `fromcash`) VALUES (NULL, @accmov_id, exp_code, exp_dat, exp_time, CURRENT_TIMESTAMP, exp_value, exp_desc, 1);
ELSE
/*if expences is salary or paid to partner , but paid from another partner not from cashier*/
/*process 0- add acc mov ,1- update payer acc prof (use fromcash as paier profid),2- update paid to acc prof,3- add expences*/
CALL `add_acc_mov` (exp_dat,exp_time,3,0,0,1,0,0,1,0);
SET @accmov_id = LAST_INSERT_ID();
/*update payer acc prof*/
INSERT INTO `acc_mov_profiles` (`acc_prof_mov_id`, `acc_mov_id`, `prof_mov_dat`, `prof_mov_time`, `prof_mov_timestamp`, `prof_id`, `acc_mov_type`, `prof_mov_value`, `prof_mov_balance`, `prof_mov_desc`, `salary`) VALUES (NULL, @accmov_id, exp_dat,exp_time ,CURRENT_TIMESTAMP, profid, 1, exp_value, 0, exp_desc,0);
/*update acc prof*/
INSERT INTO `acc_mov_profiles` (`acc_prof_mov_id`, `acc_mov_id`, `prof_mov_dat`, `prof_mov_time`, `prof_mov_timestamp`, `prof_id`, `acc_mov_type`, `prof_mov_value`, `prof_mov_balance`, `prof_mov_desc`, `salary`) VALUES (NULL, @accmov_id, exp_dat,exp_time ,CURRENT_TIMESTAMP, profid, 2, exp_value, 0, exp_desc,issalary);
/*update expences tbl*/
INSERT INTO `acc_expenses` (`exp_id`, `acc_mov_id`, `exp_code`, `exp_dat`, `exp_time`, `exp_timestamp`, `exp_value`, `exp_desc`, `fromcash`) VALUES (NULL, @accmov_id, exp_code, exp_dat, exp_time, CURRENT_TIMESTAMP, exp_value, exp_desc, 0);
END IF;
ELSE 
/* expences type is not salary or paid value to partner**/
/* if the expences is paid by the cashier not by any partner*/
IF fromcash=10000 THEN
/*process 0-update acc mov,1- update cash,2- update expences  */
CALL `add_acc_mov`(exp_dat,exp_time,3,0,0,1,0,1,0,0);
SET @accmov_id = LAST_INSERT_ID();
/*update cash*/
CALL `add_cash_mov`(@accmov_id,exp_dat,exp_time,2,0,exp_value,0,exp_desc);
/*update expences tbl*/
INSERT INTO `acc_expenses`(`exp_id`, `acc_mov_id`, `exp_code`, `exp_dat`, `exp_time`, `exp_timestamp`, `exp_value`, `exp_desc`, `fromcash`) VALUES (NULL, @accmov_id, exp_code, exp_dat, exp_time, CURRENT_TIMESTAMP, exp_value, exp_desc, 1);
ELSE 
/* if the expences is paid by any partner not by the cashier , user fromcash as the payer profid*/
/* process 0 update acc mov,1- update payer profid,2-update expences */
CALL `add_acc_mov` (exp_dat,exp_time,3,0,0,1,0,1,0,0);
SET @accmov_id = LAST_INSERT_ID();
/*update payer acc prof*/
INSERT INTO `acc_mov_profiles` (`acc_prof_mov_id`, `acc_mov_id`, `prof_mov_dat`, `prof_mov_time`, `prof_mov_timestamp`, `prof_id`, `acc_mov_type`, `prof_mov_value`, `prof_mov_balance`, `prof_mov_desc`, `salary`) VALUES (NULL, @accmov_id, exp_dat,exp_time ,CURRENT_TIMESTAMP, fromcash, 2, exp_value, 0, exp_desc,0);
/*update expences tbl*/
INSERT INTO `acc_expenses` (`exp_id`, `acc_mov_id`, `exp_code`, `exp_dat`, `exp_time`, `exp_timestamp`, `exp_value`, `exp_desc`, `fromcash`) VALUES (NULL, @accmov_id, exp_code, exp_dat, exp_time, CURRENT_TIMESTAMP, exp_value, exp_desc, 0);
END IF;
End IF;
END$$

DROP PROCEDURE IF EXISTS `add_prof_mov`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_prof_mov`(acc_mov_id int, prof_mov_dat date,prof_mov_time time,prof_id int,acc_mov_type int,prof_mov_value float,prof_mov_balance float,prof_mov_desc text)
BEGIN
INSERT INTO `acc_mov_profiles` (`acc_prof_mov_id`, `acc_mov_id`, `prof_mov_dat`, `prof_mov_time`, `prof_mov_timestamp`, `prof_id`, `acc_mov_type`, `prof_mov_value`, `prof_mov_balance`, `prof_mov_desc`) VALUES (NULL, acc_mov_id, prof_mov_dat,prof_mov_time ,CURRENT_TIMESTAMP, prof_id, acc_mov_type, prof_mov_value, prof_mov_balance, prof_mov_desc);
SELECT LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS `add_purch_mov`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_purch_mov`(IN `acc_mov_id` INT, IN `purch_type` INT, IN `purch_dat` DATE, IN `purch_time` TIME, IN `purch_value` INT, IN `fromcash` TINYINT, IN `purch_desc` TEXT, IN `st_mov_id` INT)
BEGIN
INSERT INTO `acc_purch` (`purch_id`, `acc_mov_id`, `purch_type`, `purch_dat`, `purch_time`, `purch_timestamp`, `purch_value`, `fromcash`, `purch_desc`, `st_mov_id`) VALUES (NULL, acc_mov_id, purch_type, purch_dat, purch_time, CURRENT_TIMESTAMP, purch_value, fromcash, purch_desc, st_mov_id)  ;
END$$

DROP PROCEDURE IF EXISTS `add_sales_mov`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_sales_mov`(IN `acc_mov_id` INT, IN `inv_id` INT, IN `sales_dat` DATE, IN `sales_time` TIME, IN `sales_value` FLOAT, IN `sales_paid` TINYINT, IN `sales_desc` TEXT CHARSET utf8, IN `subinv_no` INT)
BEGIN
INSERT INTO `acc_sales` (`sales_id`, `acc_mov_id`, `inv_id`, `sales_dat`, `sales_time`, `sales_timestamp`, `sales_value`, `sales_paid`, `sales_desc`, `subinv_no`)
VALUES (NULL, acc_mov_id, inv_id ,sales_dat,sales_time ,CURRENT_TIMESTAMP, sales_value, sales_paid, sales_desc,subinv_no);
SELECT LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS `add_varincome_process`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_varincome_process`(varinctyp int,varincdat date,varinctime time, varincval float,varincdesc longtext,tocash int,varinctypnam char(50))
BEGIN
/*if added to cash*/
IF tocash=1 THEN
/*process 0-update acc mov,1- update cash,2- update varincome  */
CALL `add_acc_mov`(varincdat,varinctime,4,0,0,1,0,0,0,1);
SET @accmov_id = LAST_INSERT_ID();
/*update cash*/
CALL `add_cash_mov`(@accmov_id,varincdat,varinctime,1,0,varincval,0,varincdesc);
/*update expences tbl*/
INSERT INTO `acc_varincome` (`varincome_id`, `acc_mov_id`, `varincome_dat`, `varincome_time`, `varincome_timestamp`, `varincome_value`, `varincome_desc`) VALUES (NULL, @accmov_id, varincdat, varinctime, CURRENT_TIMESTAMP, varincval, varincdesc);
ELSE
select ("nothing");
END IF;
END$$

DROP PROCEDURE IF EXISTS `buy_st_item`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `buy_st_item`(IN `boughtby` INT, IN `itmsname` VARCHAR(25), IN `itmlname` VARCHAR(200), IN `itm_type` INT, IN `itm_desc` TEXT, IN `itm_price` FLOAT, IN `userid` INT, IN `itm_qnty_unit` INT, IN `groupid` INT, IN `st_itm_mov_typ` INT, IN `cur_st_id` INT, IN `st_itm_mov_qnty` INT, IN `st_itm_mov_dat` DATE, IN `st_itm_mov_time` TIME, IN `st_itm_mov_notes` TEXT, IN `st_itm_mov_to_st` INT, IN `buyerid` INT, IN `exist_itm_id` INT)
BEGIN
IF exist_itm_id = 0 THEN

INSERT INTO `stock_items` (`itm_id`, `itm_shortname`, `itm_longname`, `itm_type`, `itm_data`, `itm_sell_price`, `itm_reg_date`, `itm_userid`, `itm_timestamp`, `itm_qnty_unit`, `group_id`) VALUES (NULL,itmsname,itmlname,itm_type,itm_desc,itm_price,st_itm_mov_dat,userid,CURRENT_TIMESTAMP,itm_qnty_unit,groupid);
SET @st_itm_id=LAST_INSERT_ID();
/**insert stock movment item to the stock itmes*/
CALL `buy_trn_spoil_ret_sals_stitem_mov` (st_itm_mov_typ,userid,@st_itm_id,cur_st_id,st_itm_mov_qnty,itm_qnty_unit,st_itm_mov_dat,st_itm_mov_notes,st_itm_mov_to_st,itm_price,buyerid,buyerid,itm_type);
SET @st_itm_mov_id = LAST_INSERT_ID();
/*insert item stock balance to the balance*/
/*CALL `update_st_blance` (@st_itm_id,cur_st_id,0,itm_qnty_unit,st_itm_mov_notes,st_itm_mov_dat,CURRENT_TIMESTAMP);*/
IF boughtby=0 THEN /*  if item bought from cashier = 0 , if bought from someone =1 */
/*insert accounting movment affect cash and purchase*/
CALL `add_acc_mov` (st_itm_mov_dat,st_itm_mov_time,2,0,0,1,1,0,0,0);
SET @accmov_id = LAST_INSERT_ID();
CALL `add_cash_mov` (@accmov_id,st_itm_mov_dat,st_itm_mov_time,2,0,itm_price,0,st_itm_mov_notes);
/**CONCAT('شراء مخزون من صنف   : ',itmsname,' صرف من الخزينة بكمية  : ',st_itm_mov_qnty,'الى المخزن رقم  : ',st_itm_mov_cur_stid)**/
CALL `add_purch_mov` (@accmov_id,itm_type,st_itm_mov_dat,st_itm_mov_time,itm_price,1,st_itm_mov_notes,@st_itm_mov_id);
/**CONCAT('شراء مخزون من صنف   : ',itmsname,' صرف من الخزينة بكمية  : ',st_itm_mov_qnty,'الى المخزن رقم  : ',st_itm_mov_cur_stid)**/
ELSE
CALL `add_acc_mov` (st_itm_mov_dat,st_itm_mov_time,2,0,1,0,1,0,1,0);
SET @acc_move_id = LAST_INSERT_ID();
CALL `add_prof_mov` (@acc_move_id,st_itm_mov_dat,st_itm_mov_time,buyerid,1,itm_price,0,st_itm_mov_notes);
CALL `add_purch_mov` (@acc_move_id,itm_type,st_itm_mov_dat,st_itm_mov_time,itm_price,0,st_itm_mov_notes,@st_itm_mov_id);
END IF;

ELSE


/*insert stock movment existing item to the stock itmes*/
CALL `buy_trn_spoil_ret_sals_stitem_mov` (st_itm_mov_typ,userid,exist_itm_id,cur_st_id,st_itm_mov_qnty,itm_qnty_unit,st_itm_mov_dat,st_itm_mov_notes,st_itm_mov_to_st,itm_price,buyerid,buyerid,itm_type);
SET @st_itm_mov_id = LAST_INSERT_ID();
/*insert item stock balance to the balance*/
/*CALL `update_st_blance` (exist_itm_id,cur_st_id,0,itm_qnty_unit,st_itm_mov_notes,st_itm_mov_dat,CURRENT_TIMESTAMP);*/
IF boughtby=0 THEN /*  if item bought from cashier = 0 , if bought from someone =1 */
/*insert accounting movment affect cash and purchase*/
CALL `add_acc_mov` (st_itm_mov_dat,st_itm_mov_time,2,0,0,1,1,0,0,0);
SET @accmov_id = LAST_INSERT_ID();
CALL `add_cash_mov` (@accmov_id,st_itm_mov_dat,st_itm_mov_time,2,0,itm_price,0,st_itm_mov_notes);
/**CONCAT('شراء مخزون من صنف   : ',itmsname,' صرف من الخزينة بكمية  : ',st_itm_mov_qnty,'الى المخزن رقم  : ',st_itm_mov_cur_stid)**/
CALL `add_purch_mov` (@accmov_id,itm_type,st_itm_mov_dat,st_itm_mov_time,itm_price,1,st_itm_mov_notes,@st_itm_mov_id);
/**CONCAT('شراء مخزون من صنف   : ',itmsname,' صرف من الخزينة بكمية  : ',st_itm_mov_qnty,'الى المخزن رقم  : ',st_itm_mov_cur_stid)**/
ELSE
CALL `add_acc_mov` (st_itm_mov_dat,st_itm_mov_time,2,0,1,0,1,0,1,0);
SET @acc_move_id = LAST_INSERT_ID();
CALL `add_prof_mov` (@acc_move_id,st_itm_mov_dat,st_itm_mov_time,buyerid,1,itm_price,0,st_itm_mov_notes);
CALL `add_purch_mov` (@acc_move_id,itm_type,st_itm_mov_dat,st_itm_mov_time,itm_price,0,st_itm_mov_notes,@st_itm_mov_id);
END IF;
END IF;
END$$

DROP PROCEDURE IF EXISTS `buy_trn_spoil_ret_sals_stitem_mov`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `buy_trn_spoil_ret_sals_stitem_mov`(IN `st_itm_mov_typ` INT, IN `st_itm_mov_usrid` INT, IN `st_itm_mov_itmid` INT, IN `st_itm_mov_cur_stid` INT, IN `st_itm_mov_qnty` INT, IN `st_itm_mov_qnty_unit` INT, IN `st_itm_mov_dat` DATE, IN `st_itm_mov_notes` TEXT, IN `st_itm_mov_to_st` INT, IN `st_itm_mov_price` FLOAT, IN `st_itm_mov_buyerid` INT, IN `st_itm_mov_profid` INT, IN `st_itm_mov_itm_typ` INT)
BEGIN
INSERT INTO `st_item_mov` (`st_itm_mov_id` ,`st_itm_mov_typ` ,`st_itm_mov_usrid` ,`st_itm_mov_itmid` ,`st_itm_mov_cur_stid` ,`st_itm_mov_qnty` ,`st_itm_mov_qnty_unit` ,`st_itm_mov_dat` ,`st_itm_mov_timstmp` ,`st_itm_mov_notes` ,`st_itm_mov_to_st` ,`st_itm_mov_st_itm_mov_price` ,`st_itm_mov_buyerid` ,`st_itm_mov_profid`, `st_itm_mov_itm_typ`)VALUES (NULL ,  st_itm_mov_typ, st_itm_mov_usrid, st_itm_mov_itmid,  st_itm_mov_cur_stid,st_itm_mov_qnty , st_itm_mov_qnty_unit,  st_itm_mov_dat, CURRENT_TIMESTAMP ,  st_itm_mov_notes,  st_itm_mov_to_st,  st_itm_mov_price, st_itm_mov_buyerid ,  st_itm_mov_profid,  st_itm_mov_itm_typ);
SELECT LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS `GetAllProducts`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllProducts`()
BEGIN
   SELECT *  FROM stock_items;
   END$$

DROP PROCEDURE IF EXISTS `getnextID`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getnextID`(IN `tablename` VARCHAR(50), IN `dbname` VARCHAR(20))
    NO SQL
BEGIN
SELECT `AUTO_INCREMENT`
FROM information_schema.tables 
WHERE table_name=tablename
AND `TABLE_SCHEMA` = dbname;
END$$

DROP PROCEDURE IF EXISTS `get_cust_unpaid_order`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_cust_unpaid_order`(IN `profid` INT)
    NO SQL
SELECT * FROM `sub_inv` 
WHERE `cust_profid`=profid 
And `paidstatus`=0$$

DROP PROCEDURE IF EXISTS `get_dashboard`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_dashboard`(IN `curdat` DATE)
BEGIN
select (select(ifnull((SELECT SUM(`cash_value`) FROM `acc_cash` WHERE `acc_mov_type`=1 and  YEAR(`acc_cash`.`cash_dat`)=YEAR(curdat) AND MONTH(`acc_cash`.`cash_dat`)=MONTH(curdat) And DAY(`acc_cash`.`cash_dat`)=DAY(curdat)),0))) as daycash,(select ifnull((select sum(`acc_sales`.`sales_value`) FROM `acc_sales` WHERE YEAR(`acc_sales`.`sales_dat`)=YEAR(curdat) AND MONTH(`acc_sales`.`sales_dat`)=MONTH(curdat) And DAY(`acc_sales`.`sales_dat`)=DAY(curdat)),0))  as daysales,(select ifnull((select sum(`acc_sales`.`sales_value`) FROM `acc_sales` WHERE `sales_paid`=0 and YEAR(`acc_sales`.`sales_dat`)=YEAR(curdat) AND MONTH(`acc_sales`.`sales_dat`)=MONTH(curdat) And DAY(`acc_sales`.`sales_dat`)=DAY(curdat)),0))  as daycredit,(select ifnull((select sum(`acc_purch`.`purch_value`) FROM `acc_purch` WHERE `fromcash`=1 and YEAR(`acc_purch`.`purch_dat`)=YEAR(curdat) AND MONTH(`acc_purch`.`purch_dat`)=MONTH(curdat) And DAY(`acc_purch`.`purch_dat`)=DAY(curdat)),0))  as daypurch,(select ifnull((select sum(`acc_expenses`.`exp_value`) FROM `acc_expenses` WHERE `fromcash`=1 and YEAR(`acc_expenses`.`exp_dat`)=YEAR(curdat) AND MONTH(`acc_expenses`.`exp_dat`)=MONTH(curdat) And DAY(`acc_expenses`.`exp_dat`)=DAY(curdat)),0))  as dayexp,(select(ifnull((SELECT SUM(`cash_value`) FROM `acc_cash` WHERE `acc_mov_type`=1 and  YEAR(`acc_cash`.`cash_dat`)=YEAR(curdat) AND MONTH(`acc_cash`.`cash_dat`)=MONTH(curdat)),0)))  as monthcash,(select ifnull((select sum(`acc_sales`.`sales_value`) FROM `acc_sales` WHERE YEAR(`acc_sales`.`sales_dat`)=YEAR(curdat) AND MONTH(`acc_sales`.`sales_dat`)=MONTH(curdat)),0))  as monthsales,(select ifnull((select sum(`acc_sales`.`sales_value`) FROM `acc_sales` WHERE `sales_paid`=0 and YEAR(`acc_sales`.`sales_dat`)=YEAR(curdat) AND MONTH(`acc_sales`.`sales_dat`)=MONTH(curdat)),0))  as monthcredit,(select ifnull((select sum(`acc_purch`.`purch_value`) FROM `acc_purch` WHERE `fromcash`=1 and YEAR(`acc_purch`.`purch_dat`)=YEAR(curdat) AND MONTH(`acc_purch`.`purch_dat`)=MONTH(curdat)),0))  as monthpurch,(select ifnull((select sum(`acc_expenses`.`exp_value`) FROM `acc_expenses` WHERE `fromcash`=1 and YEAR(`acc_expenses`.`exp_dat`)=YEAR(curdat) AND MONTH(`acc_expenses`.`exp_dat`)=MONTH(curdat)),0)) as monthexp,(select ifnull((select sum(`acc_expenses`.`exp_value`) FROM `acc_expenses` WHERE `fromcash`!=1 and YEAR(`acc_expenses`.`exp_dat`)=YEAR(curdat) AND MONTH(`acc_expenses`.`exp_dat`)=MONTH(curdat) And DAY(`acc_expenses`.`exp_dat`)=DAY(curdat)),0))  as dayexppart,(select ifnull((select sum(`acc_expenses`.`exp_value`) FROM `acc_expenses` WHERE `fromcash`!=1 and YEAR(`acc_expenses`.`exp_dat`)=YEAR(curdat) AND MONTH(`acc_expenses`.`exp_dat`)=MONTH(curdat)),0)) as monthexppart;
END$$

DROP PROCEDURE IF EXISTS `get_inv_ingr_qnty`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_inv_ingr_qnty`(inv_id int)
BEGIN
SELECT items_ingradients.itm_ingrad_id, items_ingradients.itm_ingrad_qnty_unit, (invoices_items.inv_itm_qnty * items_ingradients.itm_ingrad_qnty) AS stockquntity
FROM invoices_items
INNER JOIN items_ingradients ON items_ingradients.itm_id = invoices_items.inv_itm_id
AND invoices_items.inv_id =inv_id;
END$$

DROP PROCEDURE IF EXISTS `get_inv_items_data`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_inv_items_data`(invoiceid int)
BEGIN
SELECT invoices_items.inv_itm_id, stock_items.itm_shortname, invoices_items.inv_itm_unit_price, invoices_items.inv_itm_qnty, invoices_items.inv_itm_sum
FROM  `invoices_items` 
INNER JOIN stock_items ON invoices_items.inv_itm_id = stock_items.itm_id
WHERE invoices_items.inv_id=invoiceid;
END$$

DROP PROCEDURE IF EXISTS `get_paid_unpaid_inv`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_paid_unpaid_inv`(IN `inv_status` INT, IN `inv_prof_id` INT, IN `inv_sdat` DATE, IN `inv_edat` DATE)
BEGIN
IF inv_sdat =0 THEN

IF inv_prof_id = 0 THEN

SELECT invoices_items.inv_id, invoices.inv_total, invoices.inv_discount, invoices.inv_tax, invoices.inv_service, invoices.inv_gtotal, invoices.inv_dattime, invoices.inv_cus_prof_id, profile.fullname, invoices_items.inv_itm_id, stock_items.itm_shortname, invoices_items.inv_itm_unit_price, invoices_items.inv_itm_qnty, invoices_items.inv_itm_sum,invoices.inv_dat
FROM  `invoices` 
INNER JOIN invoices_items ON invoices.inv_id = invoices_items.inv_id
INNER JOIN stock_items ON invoices_items.inv_itm_id = stock_items.itm_id
INNER JOIN profile ON invoices.inv_cus_prof_id = profile.profileid
WHERE invoices.inv_status =inv_status
ORDER BY invoices_items.inv_id;

ELSE 

SELECT invoices_items.inv_id, invoices.inv_total, invoices.inv_discount, invoices.inv_tax, invoices.inv_service, invoices.inv_gtotal, invoices.inv_dattime, invoices.inv_cus_prof_id, profile.fullname, invoices_items.inv_itm_id, stock_items.itm_shortname, invoices_items.inv_itm_unit_price, invoices_items.inv_itm_qnty, invoices_items.inv_itm_sum
FROM  `invoices` 
INNER JOIN invoices_items ON invoices.inv_id = invoices_items.inv_id
INNER JOIN stock_items ON invoices_items.inv_itm_id = stock_items.itm_id
INNER JOIN profile ON invoices.inv_cus_prof_id = profile.profileid
WHERE invoices.inv_status =inv_status
AND invoices.inv_cus_prof_id =inv_prof_id
ORDER BY invoices_items.inv_id;
END IF;

ELSE

IF inv_prof_id = 0 THEN

SELECT invoices_items.inv_id, invoices.inv_total, invoices.inv_discount, invoices.inv_tax, invoices.inv_service, invoices.inv_gtotal, invoices.inv_dattime, invoices.inv_cus_prof_id, profile.fullname, invoices_items.inv_itm_id, stock_items.itm_shortname, invoices_items.inv_itm_unit_price, invoices_items.inv_itm_qnty, invoices_items.inv_itm_sum
FROM  `invoices` 
INNER JOIN invoices_items ON invoices.inv_id = invoices_items.inv_id
INNER JOIN stock_items ON invoices_items.inv_itm_id = stock_items.itm_id
INNER JOIN profile ON invoices.inv_cus_prof_id = profile.profileid
WHERE invoices.inv_status =inv_status
AND invoices.inv_dat BETWEEN inv_sdat AND inv_edat
ORDER BY invoices_items.inv_id;

ELSE 

SELECT invoices_items.inv_id, invoices.inv_total, invoices.inv_discount, invoices.inv_tax, invoices.inv_service, invoices.inv_gtotal, invoices.inv_dattime, invoices.inv_cus_prof_id, profile.fullname, invoices_items.inv_itm_id, stock_items.itm_shortname, invoices_items.inv_itm_unit_price, invoices_items.inv_itm_qnty, invoices_items.inv_itm_sum
FROM  `invoices` 
INNER JOIN invoices_items ON invoices.inv_id = invoices_items.inv_id
INNER JOIN stock_items ON invoices_items.inv_itm_id = stock_items.itm_id
INNER JOIN profile ON invoices.inv_cus_prof_id = profile.profileid
WHERE invoices.inv_status =inv_status
AND invoices.inv_cus_prof_id =inv_prof_id
AND invoices.inv_dat BETWEEN inv_sdat AND inv_edat
ORDER BY invoices_items.inv_id;
END IF;

END IF;
END$$

DROP PROCEDURE IF EXISTS `get_paid_unp_inv`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_paid_unp_inv`(IN `pstatus` INT, IN `profid` INT, IN `strtdate` DATE, IN `enddate` DATE)
BEGIN
IF strtdate=0 THEN
IF profid =0 THEN
SELECT invoices.inv_id,invoices.inv_total,invoices.inv_discount,invoices.inv_tax,invoices.inv_service,invoices.inv_gtotal, invoices.inv_dattime,invoices.inv_cus_prof_id,profile.fullname 
FROM `invoices` 
INNER JOIN profile ON invoices.inv_cus_prof_id=profile.profileid
WHERE invoices.inv_status=pstatus 
order by invoices.inv_id;
ELSE
SELECT invoices.inv_id,invoices.inv_total,invoices.inv_discount,invoices.inv_tax,invoices.inv_service,invoices.inv_gtotal, invoices.inv_dattime,invoices.inv_cus_prof_id,profile.fullname 
FROM `invoices` 
INNER JOIN profile ON invoices.inv_cus_prof_id=profile.profileid
WHERE invoices.inv_status=pstatus 
AND invoices.inv_cus_prof_id =profid 
order by invoices.inv_id;
END IF;
ELSE
IF profid =0 THEN
SELECT invoices.inv_id,invoices.inv_total,invoices.inv_discount,invoices.inv_tax,invoices.inv_service,invoices.inv_gtotal, invoices.inv_dattime,invoices.inv_cus_prof_id,profile.fullname 
FROM `invoices` 
INNER JOIN profile ON invoices.inv_cus_prof_id=profile.profileid
WHERE invoices.inv_status=pstatus 
AND invoices.inv_dat between strtdate and enddate
order by invoices.inv_id;
ELSE
SELECT invoices.inv_id,invoices.inv_total,invoices.inv_discount,invoices.inv_tax,invoices.inv_service,invoices.inv_gtotal, invoices.inv_dattime,invoices.inv_cus_prof_id,profile.fullname 
FROM `invoices` 
INNER JOIN profile ON invoices.inv_cus_prof_id=profile.profileid
WHERE invoices.inv_status=pstatus 
AND invoices.inv_cus_prof_id =profid 
AND invoices.inv_dat between strtdate and enddate
order by invoices.inv_id;
END IF;

END IF;
END$$

DROP PROCEDURE IF EXISTS `get_prof_accbalance`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_prof_accbalance`(IN `profid` INT, IN `startdate` DATE, IN `enddate` DATE, IN `movtype` INT)
BEGIN
IF movtype=0 THEN
SELECT `acc_prof_mov_id`,`acc_mov_type`,`acc_mov_id`,`prof_mov_value`,`prof_mov_dat`,`prof_mov_time`,`prof_mov_desc`
FROM `acc_mov_profiles`
WHERE `prof_id`=profid
AND `prof_mov_dat` BETWEEN startdate AND enddate;
ELSE
SELECT `acc_prof_mov_id`,`acc_mov_id`,`prof_mov_value`,`prof_mov_dat`,`prof_mov_time`,`prof_mov_desc`
FROM `acc_mov_profiles`
WHERE `prof_id`=profid
AND `acc_mov_type` = movtype
AND `prof_mov_dat` BETWEEN startdate AND enddate;
END IF;
END$$

DROP PROCEDURE IF EXISTS `get_safe_mov_balance`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_safe_mov_balance`(movtype tinyint,startdat date,enddate date)
BEGIN
SELECT `cash_id`,`acc_mov_id`,`cash_dat`,`cash_time`,`cash_value`,`cash_desc` 
FROM `acc_cash` 
WHERE `acc_mov_type`=movtype 
AND`cash_dat` between startdat and enddate ; 
END$$

DROP PROCEDURE IF EXISTS `get_sales_items`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_sales_items`()
BEGIN
SELECT  `itm_id` ,  `itm_shortname` ,  `itm_longname` ,  `itm_data` ,  `itm_sell_price` ,  `group_id` 
FROM  `stock_items` 
WHERE  `itm_type` =4;   
END$$

DROP PROCEDURE IF EXISTS `get_sales_rep`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_sales_rep`(paidunpaid int,startdate date,enddate date)
BEGIN
/***** paidunpaid => 0 : unpaid, 1 : paid , 2: all*****/
IF paidunpaid=0 THEN

SELECT  `sales_id` ,  `acc_mov_id` ,  `inv_id` ,  `sales_value` ,  `sales_dat` ,  `sales_desc` ,  `sales_paid` 
FROM  `acc_sales` 
WHERE  `sales_dat` BETWEEN  startdate AND enddate 
AND `sales_paid`=0;

ELSEIF paidunpaid=1 THEN

SELECT  `sales_id` ,  `acc_mov_id` ,  `inv_id` ,  `sales_value` ,  `sales_dat` ,  `sales_desc` ,  `sales_paid` 
FROM  `acc_sales` 
WHERE  `sales_dat` BETWEEN  startdate AND enddate 
AND `sales_paid`=1;

ELSE

SELECT  `sales_id` ,  `acc_mov_id` ,  `inv_id` ,  `sales_value` ,  `sales_dat` ,  `sales_desc` ,  `sales_paid` 
FROM  `acc_sales` 
WHERE  `sales_dat` BETWEEN  startdate AND enddate;
END IF;
END$$

DROP PROCEDURE IF EXISTS `get_salsitm_mov_period`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_salsitm_mov_period`(itmid int,startdat date,enddate date)
BEGIN
SELECT `itms_sales`.`date`,`itms_sales`.`qnty`,`itms_sales`.`inv_id`,`itms_sales`.`orderid`,(`itms_sales`.`qnty`)*(`stock_items`.`itm_sell_price`) as tpric FROM `itms_sales` INNER JOIN `stock_items` on `stock_items`.`itm_id`=`itms_sales`.`sitm_id`  WHERE `itms_sales`.`sitm_id`=itmid and `itms_sales`.`date` between startdat and enddate;
END$$

DROP PROCEDURE IF EXISTS `get_salsitm_sums_period`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_salsitm_sums_period`(itmid int,startdat date,enddate date)
BEGIN
SELECT SUM(`itms_sales`.`qnty`) as tqnty, (SUM(`itms_sales`.`qnty`)*(`stock_items`.`itm_sell_price`)) as tpric FROM `itms_sales` INNER JOIN `stock_items` on `stock_items`.`itm_id`=`itms_sales`.`sitm_id`  WHERE `itms_sales`.`sitm_id`=itmid and `itms_sales`.`date` between startdat and enddate;
END$$

DROP PROCEDURE IF EXISTS `get_stok_item_balance`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_stok_item_balance`(IN `itm_id` INT, IN `stock_id` INT, IN `startdat` DATE, IN `enddate` DATE, IN `balanceonly` TINYINT, OUT `outbalance` INT)
BEGIN
IF startdat = 0 THEN
IF stock_id = 0 THEN
	IF balanceonly=1 THEN
select (ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=4 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id ),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id ),0)) as balance
into outbalance
from `st_item_mov`
where `st_itm_mov_itmid`=itm_id
LIMIT 1;
select outbalance;
	ELSE
select `st_itm_mov_itmid`,ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id ),0) as bought,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id),0) as sold,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=4 and `st_itm_mov_itmid`=itm_id),0) as spoil,
(ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=4 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id ),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id ),0)) as balance
from `st_item_mov`
where `st_itm_mov_itmid`=itm_id
LIMIT 1;
	END IF;

ELSE 
     
         IF balanceonly=1 THEN
select (ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`!=stock_id and `st_itm_mov_to_st`=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`!=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=4 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id ),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)) as balance
into outbalance
from `st_item_mov` 
where `st_itm_mov_itmid`=itm_id
LIMIT 1;
select outbalance;
	     ELSE
     
select `st_itm_mov_itmid`,ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id ),0) as bought,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id),0) as sold,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_typ`=4 and `st_itm_mov_itmid`=itm_id),0) as spoiled,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`!=stock_id and `st_itm_mov_to_st`=stock_id),0) as transfered_in,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`!=stock_id),0) as trans_out,
(ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`!=stock_id and `st_itm_mov_to_st`=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`!=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=4 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`=stock_id),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)) as balance
from `st_item_mov` 
where `st_itm_mov_itmid`=itm_id
LIMIT 1;

            END IF;
END IF;

ELSE

IF stock_id = 0 THEN
	IF balanceonly=1 THEN
select (ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0)) as balance
into outbalance
from `st_item_mov`
where `st_itm_mov_itmid`=itm_id 
and `st_itm_mov_dat` between startdat and enddate
LIMIT 1;
	ELSE

 select `st_itm_mov_itmid`,ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat`  between startdat and enddate),0) as bought,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0) as sold,
(ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id ),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0)) as balance
from `st_item_mov`
where `st_itm_mov_itmid`=itm_id 
and `st_itm_mov_dat` between startdat and enddate
LIMIT 1;
	END IF;
ELSE 
	IF balanceonly=1 THEN
select(ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`!=stock_id and `st_itm_mov_to_st`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`!=stock_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)) as balance
into outbalance
from `st_item_mov`
where `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate
LIMIT 1;      
        ELSE
select `st_itm_mov_itmid`,ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_dat`  between startdat and enddate),0) as bought,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate),0) as sold,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`!=stock_id and `st_itm_mov_to_st`=stock_id and `st_itm_mov_dat` between startdat and enddate),0) as transfered_in,
ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`!=stock_id and `st_itm_mov_dat` between startdat and enddate),0) as trans_out,
(ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=2 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`!=stock_id and `st_itm_mov_to_st`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=1 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_itmid`=itm_id  and `st_itm_mov_typ`=3 and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`!=stock_id and `st_itm_mov_dat` between startdat and enddate),0)-ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=8 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)+ifnull((select sum(`st_itm_mov_qnty`) from `st_item_mov` where `st_itm_mov_typ`=7 and `st_itm_mov_itmid`=itm_id and `st_itm_mov_cur_stid`=stock_id and `st_itm_mov_to_st`=stock_id and `st_itm_mov_dat` between startdat and enddate),0)) as balance
from `st_item_mov` where `st_itm_mov_itmid`=itm_id and `st_itm_mov_dat` between startdat and enddate
LIMIT 1;
	END IF;
END IF;
END IF;
END$$

DROP PROCEDURE IF EXISTS `get_upd_itm_limits`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_upd_itm_limits`(IN `itmid` INT, IN `options0get` INT, IN `newlimit` INT)
BEGIN
IF options0get=0 THEN
IF itmid=0 THEN
SELECT  `itm_id`,`itm_limit`
FROM  `stock_items` 
WHERE  1;
ELSE
SELECT  `itm_limit`
FROM  `stock_items` 
WHERE  `itm_id` =itmid; 
END IF;
ELSE

UPDATE `stock_items`
SET `itm_limit`=newlimit
WHERE `itm_id` =itmid;

SELECT  `itm_limit`
FROM  `stock_items` 
WHERE  `itm_id` =itmid;
END IF;
END$$

DROP PROCEDURE IF EXISTS `get_varincome_rep`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_varincome_rep`(startdate date,enddate date)
BEGIN
SELECT `varincome_id`,`acc_mov_id`,`varincome_dat`,`varincome_time`,`varincome_value`,`varincome_desc`
FROM `acc_varincome` 
WHERE `varincome_dat` BETWEEN startdate AND enddate;
END$$

DROP PROCEDURE IF EXISTS `pay_unpaid_cust_subinv`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `pay_unpaid_cust_subinv`(IN `invno` INT, IN `subinv_no` INT, IN `orderid` INT, IN `sales_desc` TEXT CHARSET utf8, IN `mov_dat` DATE, IN `mov_time` TIME, IN `inv_gtotal` FLOAT, IN `profid` INT)
BEGIN
UPDATE sub_inv SET `paidstatus`=1
WHERE `maininv_id`=invno AND `subinv_no`=subinv_no AND `orderid`=orderid AND `cust_profid` =profid;
UPDATE acc_sales SET `sales_paid`=1, `sales_desc`= CONCAT(sales_desc,',وتم الدفع في : ',mov_dat)
WHERE `inv_id`=orderid AND `subinv_no`=subinv_no AND `sales_value`=inv_gtotal;
CALL `add_acc_mov` (mov_dat,mov_time,5, 0,1,1,0,0,1,0);
SET @acc_movid=LAST_INSERT_ID();
CALL `add_cash_mov` (@acc_movid,mov_dat,mov_time,1,0,inv_gtotal,0,CONCAT('دفع فاتورة آجل رقم : ',invno,' اوردر فرعي رقم',orderid,'-',subinv_no,' بواسطة العميل  ',profid));
CALL `add_prof_mov` (@acc_movid,mov_dat,mov_time,profid,1,inv_gtotal,0,CONCAT('دفع فاتورة آجل رقم : ',invno,'-',subinv_no,' اوردر فرعي رقم ',orderid,'-',subinv_no));
SELECT LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS `pay_unpaid_inv`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `pay_unpaid_inv`(IN `invid` INT, IN `profid` INT, IN `mov_dat` DATE, IN `mov_time` TIME, IN `inv_gtotal` FLOAT)
BEGIN
UPDATE invoices SET `inv_status`=1
WHERE `inv_id`=invid;
UPDATE acc_sales SET `sales_paid`=1, `sales_desc`= CONCAT(sales_desc,',وتم الدفع في : ',mov_dat)
WHERE `inv_id`=invid;
CALL `add_acc_mov` (mov_dat,mov_time,5, 0,1,1,0,0,1,0);
SET @acc_movid=LAST_INSERT_ID();
CALL `add_cash_mov` (@acc_movid,mov_dat,mov_time,1,0,inv_gtotal,0,CONCAT('دفع فاتورة آجل رقم : ',invid,' بواسطة العميل رقم : ',profid));
CALL `add_prof_mov` (@acc_movid,mov_dat,mov_time,profid,1,inv_gtotal,0,CONCAT('دفع فاتورة آجل رقم : ',invid));
SELECT LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS `populate_exp_list`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `populate_exp_list`(level int)
BEGIN
SELECT * FROM  `expen_tree_names` WHERE  `top_level_id` =level;   
END$$

DROP PROCEDURE IF EXISTS `populate_profile_lists`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `populate_profile_lists`(IN `allprof` TINYINT, IN `proftype1` INT, IN `proftype2` INT, IN `proftype3` INT)
BEGIN

IF allprof=1 THEN

SELECT  `profileid` ,  `fullname` ,  `mobile` 
FROM  `profile` 
WHERE  1;

ELSE

IF proftype2=0 THEN

SELECT  `profileid` ,  `fullname` ,  `mobile` 
FROM  `profile` 
WHERE  `type` =proftype1;

ELSE

IF proftype3=0 THEN

SELECT  `profileid` ,  `fullname` ,  `mobile` 
FROM  `profile` 
WHERE  `type` =proftype1
OR `type` =proftype2;

ELSE

SELECT  `profileid` ,  `fullname` ,  `mobile` 
FROM  `profile` 
WHERE  `type` =proftype1
OR `type` =proftype2
OR `type` =proftype3;

END IF;
END IF;
END IF;

END$$

DROP PROCEDURE IF EXISTS `save1get0_tablearrjson`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `save1get0_tablearrjson`(IN `orderoption` INT, IN `objdate` DATE, IN `objtime` TIME, IN `objdattime` DATETIME, IN `tablearrobj` LONGTEXT CHARSET utf8, IN `objdesc` TEXT CHARSET utf8)
BEGIN
IF orderoption=1 THEN
INSERT INTO `mokacafe`.`tablesorderbackup` (`tblobj_ai_id`, `tblarrobj_dat`, `tblarrobj_time`, `tblarrobj_dattime`, `tblarrobj_json`, `tblarrobj_comment`) VALUES (NULL, objdate, objtime, objdattime, tablearrobj, objdesc);
SELECT LAST_INSERT_ID();
ELSE
SELECT * 
FROM  `tablesorderbackup` 
WHERE  `tblobj_ai_id` = (SELECT MAX(tblobj_ai_id) 
FROM  `tablesorderbackup`);
END IF;
END$$

DROP PROCEDURE IF EXISTS `save_inv`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `save_inv`(IN `inv_dattime` DATETIME, IN `inv_cus_prof_id` INT, IN `inv_cus_user_id` INT, IN `inv_cashier_id` INT, IN `inv_total` FLOAT, IN `inv_discount` FLOAT, IN `inv_tax` FLOAT, IN `inv_service` FLOAT, IN `inv_gtotal` FLOAT, IN `inv_status` INT, IN `inv_dat` DATE, IN `inv_time` TIME, IN `orderno` INT)
BEGIN

INSERT INTO `invoices` (`inv_id`, `inv_dattime`, `inv_cus_prof_id`, `inv_cus_user_id`, `inv_cashier_id`, `inv_total`, `inv_discount`, `inv_tax`, `inv_service`, `inv_gtotal`, `inv_status`, `inv_timestamp`, `inv_dat`, `inv_time`, `inv_orderno`) 
VALUES (NULL, inv_dattime, inv_cus_prof_id, inv_cus_user_id, inv_cashier_id, inv_total, inv_discount, inv_tax, inv_service, inv_gtotal, inv_status, CURRENT_TIMESTAMP,inv_dat,inv_time,orderno);
SELECT LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS `save_order`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `save_order`(IN `order_dattime` DATETIME, IN `order_dat` DATE, IN `order_time` TIME, IN `table_no` INT, IN `sub_orders_no` INT, IN `table_json` LONGTEXT, IN `userid` INT)
BEGIN
INSERT INTO `orders` (`order_id`, `order_dattime`, `order_dat`, `order_time`, `table_no`, `sub_orders_no`, `table_json`, `userid`) 
VALUES (NULL, order_dattime, order_dat, order_time, table_no, sub_orders_no, table_json, userid);
SELECT LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS `save_prnt_inv`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `save_prnt_inv`(IN `act_inv_id` INT, IN `inv_dattime` DATETIME, IN `inv_cus_prof_id` INT, IN `inv_cus_user_id` INT, IN `inv_cashier_id` INT, IN `inv_total` FLOAT, IN `inv_discount` FLOAT, IN `inv_tax` FLOAT, IN `inv_service` FLOAT, IN `inv_gtotal` FLOAT)
BEGIN

 INSERT INTO  `mokacafe`.`printed_invoices` (
`prnt_inv_id` ,
`act_inv_id` ,
`inv_dattime` ,
`inv_cus_prof_id` ,
`inv_cus_user_id` ,
`inv_cashier_id` ,
`inv_total` ,
`inv_discount` ,
`inv_tax` ,
`inv_service` ,
`inv_gtotal` ,
`inv_timestamp`
)
VALUES (
NULL ,  act_inv_id,  inv_dattime,  inv_cus_prof_id,  inv_cus_user_id,  inv_cashier_id,  inv_total,  inv_discount,  inv_tax,  inv_service,  inv_gtotal, 
CURRENT_TIMESTAMP
);
SELECT LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS `save_sub_inv`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `save_sub_inv`(maininv_id int,subinv_no int,orderid int,suborderid int,cashierid int,cust_profid int,cust_userid int,total float,tax float,service float,disc float,gtotal float,paidstatus tinyint,dat date,tim time,dattime datetime,subinvjson longtext)
BEGIN
INSERT INTO `sub_inv` (`subinvid`, `maininv_id`, `subinv_no`, `orderid`, `suborderid`, `cashierid`, `cust_profid`, `cust_userid`, `total`, `tax`, `service`, `disc`, `gtotal`, `paidstatus`, `dat`, `time`, `datetime`, `subinvJson`) 
VALUES (NULL, maininv_id, subinv_no, orderid, suborderid, cashierid, cust_profid, cust_userid, total, tax, service, disc, gtotal, paidstatus, dat, tim, dattime,subinvjson);
SELECT LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS `subs_stock_mov_sell`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `subs_stock_mov_sell`(usrid int,st_itm_mov_itmid int,st_itm_mov_qnty float,st_itm_mov_qnty_unit int,st_itm_mov_dat date,st_itm_mov_notes text,st_itm_mov_profid int)
BEGIN
INSERT INTO `st_item_mov` (`st_itm_mov_id`, `st_itm_mov_typ`, `st_itm_mov_usrid`, `st_itm_mov_itmid`, `st_itm_mov_cur_stid`, `st_itm_mov_qnty`, `st_itm_mov_qnty_unit`, `st_itm_mov_dat`, `st_itm_mov_timstmp`, `st_itm_mov_notes`, `st_itm_mov_to_st`, `st_itm_mov_st_itm_mov_price`, `st_itm_mov_buyerid`, `st_itm_mov_profid`, `st_itm_mov_itm_typ`) VALUES (NULL, '1', usrid,st_itm_mov_itmid,'2' ,st_itm_mov_qnty,st_itm_mov_qnty_unit,st_itm_mov_dat,CURRENT_TIMESTAMP, st_itm_mov_notes, '2', '0',st_itm_mov_profid,st_itm_mov_profid,'2');
SELECT LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS `update_order`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_order`(IN `orderno` INT, IN `tableno` INT, IN `order_dattime` DATETIME, IN `order_dat` DATE, IN `order_time` TIME, IN `sub_orders_no` INT, IN `table_json` LONGTEXT, IN `userid` INT)
BEGIN
UPDATE `orders` SET `order_dattime`=order_dattime,`order_dat`=order_dat,`order_time`=order_time,`table_no`=tableno,`sub_orders_no`=sub_orders_no,`table_json`=table_json,`userid`=userid 
WHERE `order_id`=orderno 
AND `table_no`=tableno;
SELECT ROW_COUNT();
END$$

DROP PROCEDURE IF EXISTS `update_st_blance`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_st_blance`(IN `itm_id` INT, IN `st_id` INT, IN `act_balance` INT, IN `itm_qnty_unit` INT, IN `balance_notes` TEXT, IN `balance_dat` DATE, IN `actbalance_dattime` DATETIME)
BEGIN
SET @calcbalance =0;
CALL `get_stok_item_balance` (itm_id,st_id,0,0,1,@calcbalance);
SET @calc_act_bal_dif=(@calcbalance-act_balance);
INSERT INTO `st_items_balance` (`st_items_balance_id`, `itm_id`, `st_id`, `calc_balance`, `calc_balance_datetime`, `act_balance`, `act_balance_datetime`, `itm_qnty_unit`, `calc_act_bal_dif`, `st_items_balance_notes`, `balance_dat`) VALUES (NULL, itm_id, st_id, @calcbalance, CURRENT_TIMESTAMP, act_balance, actbalance_dattime, itm_qnty_unit, @calc_act_bal_dif, balance_notes, balance_dat);
SELECT LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS `updat_sales_items`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `updat_sales_items`(IN `itmid` INT, IN `dat` DATE, IN `dattime` DATETIME, IN `qnty` INT, IN `itmname` TEXT CHARSET utf8, IN `custprofid` INT, IN `userid` INT, IN `invid` INT, IN `orderid` INT)
BEGIN

INSERT INTO `itms_sales` (`AI_id`, `sitm_id`, `date`, `datetime`, `qnty`, `itmname`, `cust_profid`, `userid`, `inv_id`, `orderid`)
VALUES (NULL, itmid, dat ,dattime,qnty ,itmname, custprofid, userid, invid,orderid);
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `acc_cash`
--

DROP TABLE IF EXISTS `acc_cash`;
CREATE TABLE IF NOT EXISTS `acc_cash` (
  `cash_id` int(11) NOT NULL AUTO_INCREMENT,
  `acc_mov_id` int(11) NOT NULL,
  `cash_dat` date NOT NULL,
  `cash_time` time NOT NULL,
  `cash_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `acc_mov_type` int(11) NOT NULL,
  `cash_openbalance` float NOT NULL,
  `cash_value` float NOT NULL,
  `cash_endbalance` float NOT NULL,
  `cash_desc` text NOT NULL,
  PRIMARY KEY (`cash_id`),
  KEY `acc_mov_id` (`acc_mov_id`,`acc_mov_type`),
  KEY `acc_mov_type` (`acc_mov_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='جدول حركة الخزينة والكاش سواء اضافة أو خصم' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `acc_expenses`
--

DROP TABLE IF EXISTS `acc_expenses`;
CREATE TABLE IF NOT EXISTS `acc_expenses` (
  `exp_id` int(11) NOT NULL AUTO_INCREMENT,
  `acc_mov_id` int(11) NOT NULL,
  `exp_code` int(11) NOT NULL,
  `exp_dat` date NOT NULL,
  `exp_time` time NOT NULL,
  `exp_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `exp_value` float NOT NULL,
  `exp_desc` text NOT NULL,
  `fromcash` tinyint(4) NOT NULL,
  PRIMARY KEY (`exp_id`),
  KEY `acc_mov_id` (`acc_mov_id`,`exp_code`),
  KEY `exp_code` (`exp_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='جدول المصروفات' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `acc_mov`
--

DROP TABLE IF EXISTS `acc_mov`;
CREATE TABLE IF NOT EXISTS `acc_mov` (
  `acc_mov_id` int(11) NOT NULL AUTO_INCREMENT,
  `mov_dat` date NOT NULL,
  `mov_time` time NOT NULL,
  `mov_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mov_type` int(11) NOT NULL,
  `sales_table` tinyint(4) NOT NULL,
  `cust_table` tinyint(4) NOT NULL,
  `cash_table` tinyint(4) NOT NULL,
  `purch_table` tinyint(4) NOT NULL,
  `exp_table` tinyint(4) NOT NULL,
  `staff_table` tinyint(4) NOT NULL,
  `othincome_table` tinyint(4) NOT NULL,
  PRIMARY KEY (`acc_mov_id`),
  KEY `mov_type` (`mov_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='القيود - حركة الحسابات' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `acc_mov_profiles`
--

DROP TABLE IF EXISTS `acc_mov_profiles`;
CREATE TABLE IF NOT EXISTS `acc_mov_profiles` (
  `acc_prof_mov_id` int(11) NOT NULL AUTO_INCREMENT,
  `acc_mov_id` int(11) NOT NULL,
  `prof_mov_dat` date NOT NULL,
  `prof_mov_time` time NOT NULL,
  `prof_mov_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `prof_id` int(11) NOT NULL,
  `acc_mov_type` int(11) NOT NULL,
  `prof_mov_value` float NOT NULL,
  `prof_mov_balance` float NOT NULL,
  `prof_mov_desc` text NOT NULL,
  `salary` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`acc_prof_mov_id`),
  KEY `acc_mov_id` (`acc_mov_id`,`prof_id`,`acc_mov_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='جدول حركات حسابات شركاء-عاملين-عملاء' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `acc_mov_types`
--

DROP TABLE IF EXISTS `acc_mov_types`;
CREATE TABLE IF NOT EXISTS `acc_mov_types` (
  `mov_typ_id` int(11) NOT NULL AUTO_INCREMENT,
  `mov_typ_name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mov_typ_desc` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`mov_typ_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=3 ;

--
-- Dumping data for table `acc_mov_types`
--

INSERT INTO `acc_mov_types` (`mov_typ_id`, `mov_typ_name`, `mov_typ_desc`) VALUES
(1, 'مدين - يضاف', 'القيمة المذكورة يتم اضافتها الى الحساب المذكور'),
(2, 'دائن - مخصوم', 'القيمة المذكورة يتم خصمها من الحساب المذكور');

-- --------------------------------------------------------

--
-- Table structure for table `acc_pes_balance_mov`
--

DROP TABLE IF EXISTS `acc_pes_balance_mov`;
CREATE TABLE IF NOT EXISTS `acc_pes_balance_mov` (
  `balance_mov_id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `acc_mov_type` int(11) NOT NULL,
  `acc_mov_sum` int(11) NOT NULL,
  `acc_mov_desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `acc_mov_ref_tbl` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `acc_mov_ref_rowid` int(11) NOT NULL,
  `acc_mov_date` date NOT NULL,
  `acc_mov_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`balance_mov_id`),
  KEY `profile_id` (`profile_id`),
  KEY `user_id` (`user_id`),
  KEY `acc_mov_type` (`acc_mov_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `acc_purch`
--

DROP TABLE IF EXISTS `acc_purch`;
CREATE TABLE IF NOT EXISTS `acc_purch` (
  `purch_id` int(11) NOT NULL AUTO_INCREMENT,
  `acc_mov_id` int(11) NOT NULL,
  `purch_type` int(11) NOT NULL,
  `purch_dat` date NOT NULL,
  `purch_time` time NOT NULL,
  `purch_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `purch_value` double NOT NULL,
  `fromcash` tinyint(4) NOT NULL,
  `purch_desc` text NOT NULL,
  `st_mov_id` int(11) NOT NULL,
  PRIMARY KEY (`purch_id`),
  KEY `acc_mov_id` (`acc_mov_id`,`purch_type`),
  KEY `purch_type` (`purch_type`),
  KEY `st_mov_id` (`st_mov_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='جدول المشتريات سواء اصوص او مخزون' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `acc_purch_types`
--

DROP TABLE IF EXISTS `acc_purch_types`;
CREATE TABLE IF NOT EXISTS `acc_purch_types` (
  `purch_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `purch_type_name` varchar(20) NOT NULL,
  `purch_type_desc` text NOT NULL,
  PRIMARY KEY (`purch_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='جدول انواع المشتريات' AUTO_INCREMENT=3 ;

--
-- Dumping data for table `acc_purch_types`
--

INSERT INTO `acc_purch_types` (`purch_type_id`, `purch_type_name`, `purch_type_desc`) VALUES
(1, 'مشتريات أصول', 'مشتريات كافة انواع الاصول الثابتة'),
(2, 'مشتريات مخازن', 'كافة انواع مشتريات اصناف المخازن (الاصول المتداولة)');

-- --------------------------------------------------------

--
-- Table structure for table `acc_sales`
--

DROP TABLE IF EXISTS `acc_sales`;
CREATE TABLE IF NOT EXISTS `acc_sales` (
  `sales_id` int(11) NOT NULL AUTO_INCREMENT,
  `acc_mov_id` int(11) NOT NULL,
  `inv_id` int(11) NOT NULL,
  `sales_dat` date NOT NULL,
  `sales_time` time NOT NULL,
  `sales_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sales_value` float NOT NULL,
  `sales_paid` tinyint(1) NOT NULL,
  `sales_desc` text NOT NULL,
  `subinv_no` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`sales_id`),
  KEY `acc_mov_id` (`acc_mov_id`,`inv_id`),
  KEY `inv_id` (`inv_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='جدول المبيعات - التي تمت من الكاشير' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `acc_types`
--

DROP TABLE IF EXISTS `acc_types`;
CREATE TABLE IF NOT EXISTS `acc_types` (
  `mov_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `mov_type_name` varchar(50) NOT NULL,
  `mov_type_desc` text NOT NULL,
  PRIMARY KEY (`mov_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='جدول انواع الحركة في القيود ( مشتريات ، مصروفات، مبيعات، ايرادات متنوعة)' AUTO_INCREMENT=6 ;

--
-- Dumping data for table `acc_types`
--

INSERT INTO `acc_types` (`mov_type_id`, `mov_type_name`, `mov_type_desc`) VALUES
(1, 'مبيعات', 'نوع الحركة مبيعات من أصناف - من خلال الكاشير'),
(2, 'مشتريات', 'مشتريات سواء أصول أو مخزون - سواء من أفراد أو من الخزينة'),
(3, 'مصروفات', 'نوع الحركة مصروفات بكافة أنواعها - سواء من خلال الخزينة أو من خلال افراد'),
(4, 'ايرادات أخرى', 'كافة انواع الايرادات الأخرى سواء اكرامية للمكان - تبس - او تمويل كاس للخزينة أو خلافه '),
(5, 'سداد مبيعات آجل', 'سداد فواتير مسجلة للدفع آجل');

-- --------------------------------------------------------

--
-- Table structure for table `acc_varincome`
--

DROP TABLE IF EXISTS `acc_varincome`;
CREATE TABLE IF NOT EXISTS `acc_varincome` (
  `varincome_id` int(11) NOT NULL AUTO_INCREMENT,
  `acc_mov_id` int(11) NOT NULL,
  `varincome_dat` date NOT NULL,
  `varincome_time` time NOT NULL,
  `varincome_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `varincome_value` float NOT NULL,
  `varincome_desc` text NOT NULL,
  PRIMARY KEY (`varincome_id`),
  KEY `acc_mov_id` (`acc_mov_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='جدول الايرادات المتنوعة' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `cash_receipts`
--

DROP TABLE IF EXISTS `cash_receipts`;
CREATE TABLE IF NOT EXISTS `cash_receipts` (
  `rec_id` int(11) NOT NULL AUTO_INCREMENT,
  `profileid` int(11) NOT NULL,
  `rec_dat` date NOT NULL,
  `rec_html` longtext NOT NULL,
  PRIMARY KEY (`rec_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ايصالات استلام نقدية' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `expenses_tree`
--

DROP TABLE IF EXISTS `expenses_tree`;
CREATE TABLE IF NOT EXISTS `expenses_tree` (
  `exp_row_id` int(11) NOT NULL AUTO_INCREMENT,
  `exp_code` int(11) NOT NULL,
  `exp_name` varchar(50) NOT NULL,
  `exp_desc` text NOT NULL,
  PRIMARY KEY (`exp_row_id`),
  UNIQUE KEY `exp_code` (`exp_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='جدول انواع المصروفات - شجرة 3 مستويات' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `expen_tree_names`
--

DROP TABLE IF EXISTS `expen_tree_names`;
CREATE TABLE IF NOT EXISTS `expen_tree_names` (
  `exp_id` int(11) NOT NULL AUTO_INCREMENT,
  `exp_name` varchar(50) NOT NULL,
  `top_level_id` int(11) NOT NULL,
  PRIMARY KEY (`exp_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='جميع بنود المصروفات' AUTO_INCREMENT=31 ;

--
-- Dumping data for table `expen_tree_names`
--

INSERT INTO `expen_tree_names` (`exp_id`, `exp_name`, `top_level_id`) VALUES
(1, 'مصروفات عمومية', 0),
(2, 'مرتبات وأجور', 0),
(3, 'مرافق', 1),
(4, 'ايجار', 1),
(5, 'كهرباء', 3),
(6, 'غاز', 3),
(7, 'انترنت', 3),
(8, 'مياه', 3),
(17, 'اجور- مرتبات عاملين', 2),
(18, 'عمولات عاملين', 2),
(19, 'مكافئات عاملين', 2),
(20, 'اضافى عاملين', 2),
(21, 'حسابات جارية شركاء', 0),
(22, 'سلف عاملين', 2),
(23, 'ضرائب', 0),
(24, 'ضريبة مبيعات', 23),
(25, 'ضريبة عامة', 23),
(26, 'تأمينات', 0),
(27, 'تأمينات حصة الشركة', 26),
(28, 'تأمينات حصة الموظف', 26),
(29, 'مصروفات أخرى', 1),
(30, 'مصروفات فحم', 1);

-- --------------------------------------------------------

--
-- Table structure for table `exp_tree_levels`
--

DROP TABLE IF EXISTS `exp_tree_levels`;
CREATE TABLE IF NOT EXISTS `exp_tree_levels` (
  `exp_lvl_id` int(11) NOT NULL AUTO_INCREMENT,
  `level1` int(11) NOT NULL,
  `level2` int(11) NOT NULL,
  `level3` int(11) NOT NULL,
  PRIMARY KEY (`exp_lvl_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='تسكين شجرة المصروفات' AUTO_INCREMENT=7 ;

--
-- Dumping data for table `exp_tree_levels`
--

INSERT INTO `exp_tree_levels` (`exp_lvl_id`, `level1`, `level2`, `level3`) VALUES
(1, 1, 3, 5),
(2, 1, 3, 6),
(3, 1, 3, 7),
(4, 1, 3, 8),
(5, 1, 4, 0),
(6, 10, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
CREATE TABLE IF NOT EXISTS `invoices` (
  `inv_id` int(11) NOT NULL AUTO_INCREMENT,
  `inv_dattime` datetime NOT NULL,
  `inv_cus_prof_id` int(11) NOT NULL,
  `inv_cus_user_id` int(11) NOT NULL,
  `inv_cashier_id` int(11) NOT NULL,
  `inv_total` double NOT NULL,
  `inv_discount` double NOT NULL,
  `inv_tax` double NOT NULL,
  `inv_service` double NOT NULL,
  `inv_gtotal` double NOT NULL,
  `inv_status` int(11) NOT NULL,
  `inv_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `inv_dat` date NOT NULL,
  `inv_time` time NOT NULL,
  `inv_orderno` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`inv_id`),
  KEY `inv_cus_prof_id` (`inv_cus_prof_id`),
  KEY `inv_cus_user_id` (`inv_cus_user_id`),
  KEY `inv_cashier_id` (`inv_cashier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `invoices_items`
--

DROP TABLE IF EXISTS `invoices_items`;
CREATE TABLE IF NOT EXISTS `invoices_items` (
  `inv_item_ai_id` int(11) NOT NULL AUTO_INCREMENT,
  `inv_id` int(11) NOT NULL,
  `inv_itm_id` int(11) NOT NULL,
  `inv_itm_unit_price` double NOT NULL,
  `inv_itm_qnty` int(11) NOT NULL,
  `inv_itm_sum` double NOT NULL,
  PRIMARY KEY (`inv_item_ai_id`),
  KEY `inv_id` (`inv_id`),
  KEY `inv_itm_id` (`inv_itm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `items_ingradients`
--

DROP TABLE IF EXISTS `items_ingradients`;
CREATE TABLE IF NOT EXISTS `items_ingradients` (
  `item_ingradients_id` int(11) NOT NULL AUTO_INCREMENT,
  `itm_id` int(11) NOT NULL,
  `itm_ingrad_id` int(11) NOT NULL,
  `itm_ingrad_qnty` int(11) NOT NULL,
  `itm_ingrad_qnty_unit` int(11) NOT NULL,
  `itm_updt_date` date NOT NULL,
  `itm_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `itm_userid` int(11) NOT NULL,
  `itm_ingr_cost` float NOT NULL,
  PRIMARY KEY (`item_ingradients_id`),
  KEY `itm_id` (`itm_id`),
  KEY `itm_ingrad_id` (`itm_ingrad_id`),
  KEY `itm_ingrad_qnty_unit` (`itm_ingrad_qnty_unit`),
  KEY `itm_userid` (`itm_userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `itms_sales`
--

DROP TABLE IF EXISTS `itms_sales`;
CREATE TABLE IF NOT EXISTS `itms_sales` (
  `AI_id` int(11) NOT NULL AUTO_INCREMENT,
  `sitm_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `datetime` datetime NOT NULL,
  `qnty` int(11) NOT NULL,
  `itmname` text COLLATE utf8_unicode_ci NOT NULL,
  `cust_profid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `inv_id` int(11) NOT NULL,
  `orderid` int(11) NOT NULL,
  PRIMARY KEY (`AI_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='تسجيل مبيعات الاصناف' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_dattime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `order_dat` date NOT NULL,
  `order_time` time NOT NULL,
  `table_no` int(11) NOT NULL,
  `sub_orders_no` int(11) NOT NULL,
  `table_json` longtext NOT NULL,
  `userid` int(11) NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='save orders' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `printed_invoices`
--

DROP TABLE IF EXISTS `printed_invoices`;
CREATE TABLE IF NOT EXISTS `printed_invoices` (
  `prnt_inv_id` int(11) NOT NULL AUTO_INCREMENT,
  `act_inv_id` int(11) NOT NULL,
  `inv_dattime` datetime NOT NULL,
  `inv_cus_prof_id` int(11) NOT NULL,
  `inv_cus_user_id` int(11) NOT NULL,
  `inv_cashier_id` int(11) NOT NULL,
  `inv_total` double NOT NULL,
  `inv_discount` double NOT NULL,
  `inv_tax` double NOT NULL,
  `inv_service` double NOT NULL,
  `inv_gtotal` double NOT NULL,
  `inv_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`prnt_inv_id`),
  KEY `inv_cus_prof_id` (`inv_cus_prof_id`),
  KEY `inv_cus_user_id` (`inv_cus_user_id`),
  KEY `inv_cashier_id` (`inv_cashier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `printed_inv_items`
--

DROP TABLE IF EXISTS `printed_inv_items`;
CREATE TABLE IF NOT EXISTS `printed_inv_items` (
  `inv_item_ai_id` int(11) NOT NULL AUTO_INCREMENT,
  `inv_id` int(11) NOT NULL,
  `act_inv_id` int(11) NOT NULL,
  `inv_itm_id` int(11) NOT NULL,
  `inv_itm_unit_price` double NOT NULL,
  `inv_itm_qnty` int(11) NOT NULL,
  `inv_itm_sum` double NOT NULL,
  PRIMARY KEY (`inv_item_ai_id`),
  KEY `inv_id` (`inv_id`),
  KEY `inv_itm_id` (`inv_itm_id`),
  KEY `prnt_inv_row_id` (`act_inv_id`),
  KEY `prnt_inv_row_id_2` (`act_inv_id`),
  KEY `inv_id_2` (`inv_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
CREATE TABLE IF NOT EXISTS `profile` (
  `user_id` int(11) NOT NULL,
  `profileid` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile2` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jobtitle` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` int(11) NOT NULL,
  `phone` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`profileid`),
  KEY `user_id` (`user_id`),
  KEY `type` (`type`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=2 ;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`user_id`, `profileid`, `fullname`, `mobile`, `mobile2`, `email`, `address`, `jobtitle`, `type`, `phone`, `notes`) VALUES
(1, 1, 'Mohammed Khlaifa', '01114442161', '01114442161', 'mk@khalifaonline.com', '162 King Faisal St., Haram Giza', 'Super Admin', 1, '33837794', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `profile_types`
--

DROP TABLE IF EXISTS `profile_types`;
CREATE TABLE IF NOT EXISTS `profile_types` (
  `profile_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_type_name` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_type_desc` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`profile_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=6 ;

--
-- Dumping data for table `profile_types`
--

INSERT INTO `profile_types` (`profile_type_id`, `profile_type_name`, `profile_type_desc`) VALUES
(1, 'systemuser', 'مدير نظام متحكم'),
(2, 'owner', 'مالك او شريك'),
(3, 'staffmember', 'موظفين / عاملين'),
(4, 'عميل', 'عميل او زائر للمكان'),
(5, 'system_item', 'عنصر وهمي يستخدم بواسطة النظام -مثل الخزينة - حساب');

-- --------------------------------------------------------

--
-- Table structure for table `stock_items`
--

DROP TABLE IF EXISTS `stock_items`;
CREATE TABLE IF NOT EXISTS `stock_items` (
  `itm_id` int(11) NOT NULL AUTO_INCREMENT,
  `itm_shortname` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `itm_longname` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `itm_type` int(11) NOT NULL,
  `itm_data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `itm_sell_price` float NOT NULL,
  `itm_reg_date` date NOT NULL,
  `itm_userid` int(11) NOT NULL,
  `itm_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `itm_qnty_unit` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `itm_limit` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`itm_id`),
  KEY `itm_type` (`itm_type`),
  KEY `itm_userid` (`itm_userid`),
  KEY `itm_qnty_unit` (`itm_qnty_unit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `st_items_balance`
--

DROP TABLE IF EXISTS `st_items_balance`;
CREATE TABLE IF NOT EXISTS `st_items_balance` (
  `st_items_balance_id` int(11) NOT NULL AUTO_INCREMENT,
  `itm_id` int(11) NOT NULL,
  `st_id` int(11) NOT NULL,
  `calc_balance` int(11) NOT NULL,
  `calc_balance_datetime` datetime NOT NULL,
  `act_balance` int(11) NOT NULL,
  `act_balance_datetime` datetime NOT NULL,
  `itm_qnty_unit` int(11) NOT NULL,
  `calc_act_bal_dif` int(11) NOT NULL,
  `st_items_balance_notes` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `balance_dat` date NOT NULL,
  `bal_type` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`st_items_balance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `st_items_types`
--

DROP TABLE IF EXISTS `st_items_types`;
CREATE TABLE IF NOT EXISTS `st_items_types` (
  `st_itm_id` int(11) NOT NULL AUTO_INCREMENT,
  `st_itm_typ_nam` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `st_itm_typ_desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`st_itm_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=5 ;

--
-- Dumping data for table `st_items_types`
--

INSERT INTO `st_items_types` (`st_itm_id`, `st_itm_typ_nam`, `st_itm_typ_desc`) VALUES
(1, 'اصول', 'يتم تسيجل اي صنف ينتمي للأصول بهذا النوع من انواع الأصناف'),
(2, 'خامات تحضير', 'يتم تسيجل اي صنف خام يستخدم في تحضير اصناف للبيع ولا يمكن بيعه كما هو'),
(3, 'خامات جاهزة للبيع', 'يتم تسيجل اي صنف من اصناف الخامات الجاهزة التي يمكن بيعها مباشرة دون اي اضافات بهذا النوع من انواع الأصناف'),
(4, 'صنف محضر للبيع', 'هو الصنف الجاهز للبيع بعد ان تم تحضيره من مجموعة من الأصناف الخام في البوفيه\nوهو صنف يظهر في شاشة الكاشير');

-- --------------------------------------------------------

--
-- Table structure for table `st_item_mov`
--

DROP TABLE IF EXISTS `st_item_mov`;
CREATE TABLE IF NOT EXISTS `st_item_mov` (
  `st_itm_mov_id` int(11) NOT NULL AUTO_INCREMENT,
  `st_itm_mov_typ` int(11) NOT NULL,
  `st_itm_mov_usrid` int(11) NOT NULL,
  `st_itm_mov_itmid` int(11) NOT NULL,
  `st_itm_mov_cur_stid` int(11) NOT NULL,
  `st_itm_mov_qnty` int(11) NOT NULL,
  `st_itm_mov_qnty_unit` int(11) NOT NULL,
  `st_itm_mov_dat` date NOT NULL,
  `st_itm_mov_timstmp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `st_itm_mov_notes` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `st_itm_mov_to_st` int(11) NOT NULL,
  `st_itm_mov_st_itm_mov_price` int(11) NOT NULL,
  `st_itm_mov_buyerid` int(11) NOT NULL,
  `st_itm_mov_profid` int(11) NOT NULL,
  `st_itm_mov_itm_typ` int(11) NOT NULL,
  PRIMARY KEY (`st_itm_mov_id`),
  KEY `st_itm_mov_typ` (`st_itm_mov_typ`),
  KEY `st_itm_mov_usrid` (`st_itm_mov_usrid`),
  KEY `st_itm_mov_itmid` (`st_itm_mov_itmid`),
  KEY `st_itm_mov_cur_stid` (`st_itm_mov_cur_stid`),
  KEY `st_itm_mov_qnty_unit` (`st_itm_mov_qnty_unit`),
  KEY `st_itm_mov_to_st` (`st_itm_mov_to_st`),
  KEY `st_itm_mov_buyerid` (`st_itm_mov_buyerid`),
  KEY `st_itm_mov_profid` (`st_itm_mov_profid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `st_item_mov_types`
--

DROP TABLE IF EXISTS `st_item_mov_types`;
CREATE TABLE IF NOT EXISTS `st_item_mov_types` (
  `st_itm_mov_typ_id` int(11) NOT NULL AUTO_INCREMENT,
  `st_itm_mov_typ_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `st_itm_mov_typ_desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`st_itm_mov_typ_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=9 ;

--
-- Dumping data for table `st_item_mov_types`
--

INSERT INTO `st_item_mov_types` (`st_itm_mov_typ_id`, `st_itm_mov_typ_name`, `st_itm_mov_typ_desc`) VALUES
(1, 'بيع', 'عملية بيع للمنتج الخام الجاهز أو تقليل رصيد خامات نتيجة بيع منتج مجهز'),
(2, 'شراء', 'نتيجة شراء واضافة اصناف للمخزن'),
(3, 'نقل لمخزن', 'عملية نقل اصناف بين المخازن'),
(4, 'تلف', 'عملية تلف صنف تؤدي الى خصم من رصيد الصنف في المخزن'),
(5, 'مرتجع', 'عملية ارجاع اصناف للمخزن تزيد من الرصيد - لا يمكن ارجاع اصنافتم تحضيرها'),
(6, 'اضافة صنف محضر للحرك', 'اضافة صنف محضر لحركة المخازن لغرض تسجيل الحركة فقط'),
(7, 'تصحيح جرد اضافة رصيد', 'تصحيح جرد فعلي للصنف بالاضافة الى الرصيد'),
(8, 'تصحيح جرد خصم رصيد', 'تصحيح جرد فعلي للصنف بالحذف او الخصم من الرصيد');

-- --------------------------------------------------------

--
-- Table structure for table `st_item_qnty_unit`
--

DROP TABLE IF EXISTS `st_item_qnty_unit`;
CREATE TABLE IF NOT EXISTS `st_item_qnty_unit` (
  `st_itm_qnty_unit_id` int(11) NOT NULL AUTO_INCREMENT,
  `st_itm_qnty_unit_name` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `st_itm_qnty_unit_desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`st_itm_qnty_unit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `st_names`
--

DROP TABLE IF EXISTS `st_names`;
CREATE TABLE IF NOT EXISTS `st_names` (
  `st_id` int(11) NOT NULL AUTO_INCREMENT,
  `st_name` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `st_desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`st_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=6 ;

--
-- Dumping data for table `st_names`
--

INSERT INTO `st_names` (`st_id`, `st_name`, `st_desc`) VALUES
(1, 'المخزن الرئيسي', 'المخزن الرئيسي'),
(2, 'مخزن البوفيه', 'مخزن البوفيه الذي يتم تحضير الطلبات منه ويتم عليه اغلب الحركات'),
(3, 'الصالة والحمامات', 'وتحتوي الاصناف الاستهلاكية مثل الصابون وغيره'),
(4, 'مخزن الأصول', 'مخزن الأصول وفيه جرد جميع الأصناف من الاصول الخاصة بالمكان'),
(5, 'مخزن وهمي اصناف بيع', 'مخزن وهمي للاصناف المحضرة للبيع');

-- --------------------------------------------------------

--
-- Table structure for table `st_sales_itm_gropus`
--

DROP TABLE IF EXISTS `st_sales_itm_gropus`;
CREATE TABLE IF NOT EXISTS `st_sales_itm_gropus` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `group_desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=6 ;

--
-- Dumping data for table `st_sales_itm_gropus`
--

INSERT INTO `st_sales_itm_gropus` (`group_id`, `group_name`, `group_desc`) VALUES
(1, 'مشروبات باردة', 'المشروبات الباردة والعصائر'),
(2, 'مشروبات ساخنة', 'المشروبات الساخنة'),
(3, 'شيشة', 'الشيشة بانواعها والمعسل بانواعه'),
(4, 'أخرى', 'اي اصناف اخرى لم يتم ذكرها في المجموعات السابقة'),
(5, 'مأكولات', 'جميع اصناف المأكولات ');

-- --------------------------------------------------------

--
-- Table structure for table `sub_inv`
--

DROP TABLE IF EXISTS `sub_inv`;
CREATE TABLE IF NOT EXISTS `sub_inv` (
  `subinvid` int(11) NOT NULL AUTO_INCREMENT,
  `maininv_id` int(11) NOT NULL,
  `subinv_no` int(11) NOT NULL,
  `orderid` int(11) NOT NULL,
  `suborderid` int(11) NOT NULL,
  `cashierid` int(11) NOT NULL,
  `cust_profid` int(11) NOT NULL,
  `cust_userid` int(11) NOT NULL,
  `total` float NOT NULL,
  `tax` float NOT NULL,
  `service` float NOT NULL,
  `disc` float NOT NULL,
  `gtotal` float NOT NULL,
  `paidstatus` tinyint(4) NOT NULL,
  `dat` date NOT NULL,
  `time` time NOT NULL,
  `datetime` datetime NOT NULL,
  `subinvJson` longtext COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`subinvid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tablesorderbackup`
--

DROP TABLE IF EXISTS `tablesorderbackup`;
CREATE TABLE IF NOT EXISTS `tablesorderbackup` (
  `tblobj_ai_id` int(11) NOT NULL AUTO_INCREMENT,
  `tblarrobj_dat` date NOT NULL,
  `tblarrobj_time` time NOT NULL,
  `tblarrobj_dattime` datetime NOT NULL,
  `tblarrobj_json` longtext COLLATE utf8_unicode_ci NOT NULL,
  `tblarrobj_comment` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`tblobj_ai_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='storing tables json objects array' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permission` int(11) NOT NULL,
  `Last_Login` datetime NOT NULL,
  `Registration_Date` date NOT NULL,
  `Expiration_Date` date NOT NULL,
  `userlogin_flag` tinyint(4) NOT NULL,
  `sessionDB_ID` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=2 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `ip`, `user_type`, `permission`, `Last_Login`, `Registration_Date`, `Expiration_Date`, `userlogin_flag`, `sessionDB_ID`, `password`) VALUES
(1, 'administrator', '0', 'superadmin', 0, '2015-07-31 00:00:00', '2015-07-31', '2020-10-31', 1, '0', 'b3aca92c793ee0e9b1a9b0a5f5fc044e05140df3');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `acc_cash`
--
ALTER TABLE `acc_cash`
  ADD CONSTRAINT `acc_cash_ibfk_2` FOREIGN KEY (`acc_mov_id`) REFERENCES `acc_mov` (`acc_mov_id`),
  ADD CONSTRAINT `acc_cash_ibfk_3` FOREIGN KEY (`acc_mov_type`) REFERENCES `acc_mov_types` (`mov_typ_id`),
  ADD CONSTRAINT `acc_cash_ibfk_4` FOREIGN KEY (`acc_mov_id`) REFERENCES `acc_mov` (`acc_mov_id`),
  ADD CONSTRAINT `acc_cash_ibfk_5` FOREIGN KEY (`acc_mov_type`) REFERENCES `acc_mov_types` (`mov_typ_id`);

--
-- Constraints for table `acc_expenses`
--
ALTER TABLE `acc_expenses`
  ADD CONSTRAINT `acc_expenses_ibfk_1` FOREIGN KEY (`acc_mov_id`) REFERENCES `acc_mov` (`acc_mov_id`),
  ADD CONSTRAINT `acc_expenses_ibfk_3` FOREIGN KEY (`exp_code`) REFERENCES `expen_tree_names` (`exp_id`),
  ADD CONSTRAINT `acc_expenses_ibfk_4` FOREIGN KEY (`acc_mov_id`) REFERENCES `acc_mov` (`acc_mov_id`),
  ADD CONSTRAINT `acc_expenses_ibfk_5` FOREIGN KEY (`exp_code`) REFERENCES `expen_tree_names` (`exp_id`);

--
-- Constraints for table `acc_mov`
--
ALTER TABLE `acc_mov`
  ADD CONSTRAINT `acc_mov_ibfk_1` FOREIGN KEY (`mov_type`) REFERENCES `acc_types` (`mov_type_id`),
  ADD CONSTRAINT `acc_mov_ibfk_2` FOREIGN KEY (`mov_type`) REFERENCES `acc_types` (`mov_type_id`);

--
-- Constraints for table `acc_pes_balance_mov`
--
ALTER TABLE `acc_pes_balance_mov`
  ADD CONSTRAINT `acc_pes_balance_mov_ibfk_4` FOREIGN KEY (`profile_id`) REFERENCES `profile` (`profileid`),
  ADD CONSTRAINT `acc_pes_balance_mov_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `acc_pes_balance_mov_ibfk_6` FOREIGN KEY (`acc_mov_type`) REFERENCES `acc_mov_types` (`mov_typ_id`),
  ADD CONSTRAINT `acc_pes_balance_mov_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `profile` (`profileid`),
  ADD CONSTRAINT `acc_pes_balance_mov_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `acc_pes_balance_mov_ibfk_3` FOREIGN KEY (`acc_mov_type`) REFERENCES `acc_mov_types` (`mov_typ_id`);

--
-- Constraints for table `acc_purch`
--
ALTER TABLE `acc_purch`
  ADD CONSTRAINT `acc_purch_ibfk_1` FOREIGN KEY (`acc_mov_id`) REFERENCES `acc_mov` (`acc_mov_id`),
  ADD CONSTRAINT `acc_purch_ibfk_3` FOREIGN KEY (`st_mov_id`) REFERENCES `st_item_mov` (`st_itm_mov_id`),
  ADD CONSTRAINT `acc_purch_ibfk_4` FOREIGN KEY (`purch_type`) REFERENCES `st_items_types` (`st_itm_id`),
  ADD CONSTRAINT `acc_purch_ibfk_5` FOREIGN KEY (`acc_mov_id`) REFERENCES `acc_mov` (`acc_mov_id`),
  ADD CONSTRAINT `acc_purch_ibfk_6` FOREIGN KEY (`st_mov_id`) REFERENCES `st_item_mov` (`st_itm_mov_id`),
  ADD CONSTRAINT `acc_purch_ibfk_7` FOREIGN KEY (`purch_type`) REFERENCES `st_items_types` (`st_itm_id`);

--
-- Constraints for table `acc_sales`
--
ALTER TABLE `acc_sales`
  ADD CONSTRAINT `acc_sales_ibfk_1` FOREIGN KEY (`acc_mov_id`) REFERENCES `acc_mov` (`acc_mov_id`),
  ADD CONSTRAINT `acc_sales_ibfk_2` FOREIGN KEY (`acc_mov_id`) REFERENCES `acc_mov` (`acc_mov_id`);

--
-- Constraints for table `acc_varincome`
--
ALTER TABLE `acc_varincome`
  ADD CONSTRAINT `acc_varincome_ibfk_1` FOREIGN KEY (`acc_mov_id`) REFERENCES `acc_mov` (`acc_mov_id`),
  ADD CONSTRAINT `acc_varincome_ibfk_2` FOREIGN KEY (`acc_mov_id`) REFERENCES `acc_mov` (`acc_mov_id`);

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`inv_cus_prof_id`) REFERENCES `profile` (`profileid`),
  ADD CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`inv_cus_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `invoices_ibfk_3` FOREIGN KEY (`inv_cashier_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `invoices_ibfk_4` FOREIGN KEY (`inv_cus_prof_id`) REFERENCES `profile` (`profileid`),
  ADD CONSTRAINT `invoices_ibfk_5` FOREIGN KEY (`inv_cus_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `invoices_ibfk_6` FOREIGN KEY (`inv_cashier_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `invoices_items`
--
ALTER TABLE `invoices_items`
  ADD CONSTRAINT `invoices_items_ibfk_1` FOREIGN KEY (`inv_id`) REFERENCES `invoices` (`inv_id`),
  ADD CONSTRAINT `invoices_items_ibfk_2` FOREIGN KEY (`inv_itm_id`) REFERENCES `stock_items` (`itm_id`),
  ADD CONSTRAINT `invoices_items_ibfk_3` FOREIGN KEY (`inv_id`) REFERENCES `invoices` (`inv_id`),
  ADD CONSTRAINT `invoices_items_ibfk_4` FOREIGN KEY (`inv_itm_id`) REFERENCES `stock_items` (`itm_id`);

--
-- Constraints for table `items_ingradients`
--
ALTER TABLE `items_ingradients`
  ADD CONSTRAINT `items_ingradients_ibfk_1` FOREIGN KEY (`itm_id`) REFERENCES `stock_items` (`itm_id`),
  ADD CONSTRAINT `items_ingradients_ibfk_2` FOREIGN KEY (`itm_ingrad_id`) REFERENCES `stock_items` (`itm_id`),
  ADD CONSTRAINT `items_ingradients_ibfk_3` FOREIGN KEY (`itm_ingrad_qnty_unit`) REFERENCES `st_item_qnty_unit` (`st_itm_qnty_unit_id`),
  ADD CONSTRAINT `items_ingradients_ibfk_4` FOREIGN KEY (`itm_userid`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `items_ingradients_ibfk_5` FOREIGN KEY (`itm_id`) REFERENCES `stock_items` (`itm_id`),
  ADD CONSTRAINT `items_ingradients_ibfk_6` FOREIGN KEY (`itm_ingrad_id`) REFERENCES `stock_items` (`itm_id`),
  ADD CONSTRAINT `items_ingradients_ibfk_7` FOREIGN KEY (`itm_ingrad_qnty_unit`) REFERENCES `st_item_qnty_unit` (`st_itm_qnty_unit_id`),
  ADD CONSTRAINT `items_ingradients_ibfk_8` FOREIGN KEY (`itm_userid`) REFERENCES `users` (`id`);

--
-- Constraints for table `printed_invoices`
--
ALTER TABLE `printed_invoices`
  ADD CONSTRAINT `printed_invoices_ibfk_4` FOREIGN KEY (`inv_cus_prof_id`) REFERENCES `profile` (`profileid`),
  ADD CONSTRAINT `printed_invoices_ibfk_5` FOREIGN KEY (`inv_cus_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `printed_invoices_ibfk_6` FOREIGN KEY (`inv_cashier_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `printed_invoices_ibfk_1` FOREIGN KEY (`inv_cus_prof_id`) REFERENCES `profile` (`profileid`),
  ADD CONSTRAINT `printed_invoices_ibfk_2` FOREIGN KEY (`inv_cus_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `printed_invoices_ibfk_3` FOREIGN KEY (`inv_cashier_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `printed_inv_items`
--
ALTER TABLE `printed_inv_items`
  ADD CONSTRAINT `printed_inv_items_ibfk_3` FOREIGN KEY (`inv_id`) REFERENCES `printed_invoices` (`prnt_inv_id`),
  ADD CONSTRAINT `printed_inv_items_ibfk_4` FOREIGN KEY (`inv_itm_id`) REFERENCES `stock_items` (`itm_id`),
  ADD CONSTRAINT `printed_inv_items_ibfk_1` FOREIGN KEY (`inv_id`) REFERENCES `printed_invoices` (`prnt_inv_id`),
  ADD CONSTRAINT `printed_inv_items_ibfk_2` FOREIGN KEY (`inv_itm_id`) REFERENCES `stock_items` (`itm_id`);

--
-- Constraints for table `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `profile_ibfk_2` FOREIGN KEY (`type`) REFERENCES `profile_types` (`profile_type_id`),
  ADD CONSTRAINT `profile_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `profile_ibfk_4` FOREIGN KEY (`type`) REFERENCES `profile_types` (`profile_type_id`);

--
-- Constraints for table `stock_items`
--
ALTER TABLE `stock_items`
  ADD CONSTRAINT `stock_items_ibfk_1` FOREIGN KEY (`itm_type`) REFERENCES `st_items_types` (`st_itm_id`),
  ADD CONSTRAINT `stock_items_ibfk_2` FOREIGN KEY (`itm_userid`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `stock_items_ibfk_3` FOREIGN KEY (`itm_qnty_unit`) REFERENCES `st_item_qnty_unit` (`st_itm_qnty_unit_id`),
  ADD CONSTRAINT `stock_items_ibfk_4` FOREIGN KEY (`itm_type`) REFERENCES `st_items_types` (`st_itm_id`),
  ADD CONSTRAINT `stock_items_ibfk_5` FOREIGN KEY (`itm_userid`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `stock_items_ibfk_6` FOREIGN KEY (`itm_qnty_unit`) REFERENCES `st_item_qnty_unit` (`st_itm_qnty_unit_id`);

--
-- Constraints for table `st_item_mov`
--
ALTER TABLE `st_item_mov`
  ADD CONSTRAINT `st_item_mov_ibfk_1` FOREIGN KEY (`st_itm_mov_typ`) REFERENCES `st_item_mov_types` (`st_itm_mov_typ_id`),
  ADD CONSTRAINT `st_item_mov_ibfk_10` FOREIGN KEY (`st_itm_mov_usrid`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `st_item_mov_ibfk_11` FOREIGN KEY (`st_itm_mov_cur_stid`) REFERENCES `st_names` (`st_id`),
  ADD CONSTRAINT `st_item_mov_ibfk_12` FOREIGN KEY (`st_itm_mov_qnty_unit`) REFERENCES `st_item_qnty_unit` (`st_itm_qnty_unit_id`),
  ADD CONSTRAINT `st_item_mov_ibfk_13` FOREIGN KEY (`st_itm_mov_to_st`) REFERENCES `st_names` (`st_id`),
  ADD CONSTRAINT `st_item_mov_ibfk_14` FOREIGN KEY (`st_itm_mov_itmid`) REFERENCES `stock_items` (`itm_id`),
  ADD CONSTRAINT `st_item_mov_ibfk_2` FOREIGN KEY (`st_itm_mov_usrid`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `st_item_mov_ibfk_3` FOREIGN KEY (`st_itm_mov_cur_stid`) REFERENCES `st_names` (`st_id`),
  ADD CONSTRAINT `st_item_mov_ibfk_4` FOREIGN KEY (`st_itm_mov_qnty_unit`) REFERENCES `st_item_qnty_unit` (`st_itm_qnty_unit_id`),
  ADD CONSTRAINT `st_item_mov_ibfk_5` FOREIGN KEY (`st_itm_mov_to_st`) REFERENCES `st_names` (`st_id`),
  ADD CONSTRAINT `st_item_mov_ibfk_8` FOREIGN KEY (`st_itm_mov_itmid`) REFERENCES `stock_items` (`itm_id`),
  ADD CONSTRAINT `st_item_mov_ibfk_9` FOREIGN KEY (`st_itm_mov_typ`) REFERENCES `st_item_mov_types` (`st_itm_mov_typ_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
