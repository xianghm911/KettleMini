package com.winning.web.service;

import com.alibaba.fastjson.JSONArray;
import com.winning.kettleMini.Exception.BaseException;
import com.winning.kettleMini.beans.TaskTiming;
import com.winning.kettleMini.jdbc.ConnectionManager;
import com.winning.kettleMini.scheduler.QuartzJobFactory;
import com.winning.kettleMini.scheduler.QuartzManager;
import com.winning.web.beans.KettleFileJob;
import org.apache.commons.dbutils.DbUtils;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import org.apache.commons.lang.StringUtils;

import java.sql.Connection;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class KettleFileJobService {


    public void saveKettleFileJob(KettleFileJob kettleFileJob) throws Exception {
        SimpleDateFormat dateFormat  = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        final String SQL = "insert into KETTLE_FILE_JOB (id,jobName,jobDetail,jobPath,status,createTime) values (?,?,?,?,?,?)";
        Connection conn =  ConnectionManager.getConnection();
        try {
            new QueryRunner().update(conn,SQL,kettleFileJob.getId(),kettleFileJob.getJobName(),kettleFileJob.getJobDetail(),kettleFileJob.getJobPath(),"1",dateFormat.format(new Date()));
        } catch (Exception e) {
            e.printStackTrace();
            throw  new BaseException(e.getMessage());
        } finally {
            DbUtils.closeQuietly(conn);
        }
    }


    public List<KettleFileJob> queryKettleFileJob(KettleFileJob kettleFileJob) throws Exception {
        List<KettleFileJob> jobList = new ArrayList<>();
        ConnectionManager.getConnection();
        StringBuffer SQL = new StringBuffer("select id,jobName,jobDetail,jobPath,status,quartzJson,createTime from KETTLE_FILE_JOB where 1=1 ");

        Integer i = 0;
        if(kettleFileJob.getJobName() != null){
            SQL.append(" and jobName like ? ");
            i++;
        }
        if(kettleFileJob.getJobDetail() != null){
            SQL.append(" and jobDetail like ? ");
            i++;
        }
        if(kettleFileJob.getStatus() != null){
            SQL.append(" and status = ? ");
            i++;
        }
        SQL.append(" order by createTime desc");
        Object[] params = new Object[i];
        Integer j = 0;
        if(kettleFileJob.getJobName() != null){
            params[j] = "%" + kettleFileJob.getJobName() + "%";
            j++;
        }
        if(kettleFileJob.getJobDetail() != null){
            params[j] = "%" + kettleFileJob.getJobDetail() + "%";
            j++;
        }
        if(kettleFileJob.getStatus() != null){
            params[j] = kettleFileJob.getStatus();
            j++;
        }
        Connection conn =  ConnectionManager.getConnection();
        try {
            jobList = new QueryRunner().query(conn, SQL.toString(), new BeanListHandler<KettleFileJob>(KettleFileJob.class),params);
        } catch (Exception e) {
            conn.rollback();
            throw  new BaseException(e.getMessage());
        } finally {
            DbUtils.closeQuietly(conn);
        }
        return jobList;
    }


    public void saveDssz(String jobid,String taskTimingJson )throws Exception {
        final String SQL = "update KETTLE_FILE_JOB set quartzJson = ? where id = ?";
        Connection conn =  ConnectionManager.getConnection();
        try {
            new QueryRunner().update(conn,SQL,taskTimingJson,jobid);
        } catch (Exception e) {
            conn.rollback();
            throw  new BaseException(e.getMessage());
        } finally {
            DbUtils.closeQuietly(conn);
        }
    }


    public void startJob(String id ,String quartzJson,String jobPath) throws Exception {
        if(StringUtils.isBlank(quartzJson)){
            throw  new BaseException("该任务没有配置定时！");
        }
        final String SQL = "update KETTLE_FILE_JOB set status = '2' where id = ?";
        Connection conn =  ConnectionManager.getConnection();
        try {
            TaskTiming taskTiming = JSONArray.parseObject(quartzJson, TaskTiming.class);
            QuartzManager.removeJob(id);
            KettleFileJob job = new KettleFileJob();
            job.setId(id);
            job.setJobPath(jobPath);
            job.setQuartzJson(quartzJson);
            //添加定时任务
            QuartzManager.addJob(id, QuartzJobFactory.class, QuartzManager.getCron(taskTiming),job);
            new QueryRunner().update(conn,SQL,id);
        }catch (Exception e) {
                conn.rollback();
                throw  new BaseException(e.getMessage());
        } finally {
            DbUtils.closeQuietly(conn);
        }
    }



    public void stopJob(String id) throws Exception {
        Connection conn =  ConnectionManager.getConnection();
        final String SQL = "update KETTLE_FILE_JOB set status = '1' where id = ?";
        try {
            QuartzManager.removeJob(id);
            new QueryRunner().update(conn,SQL,id);
        }catch (Exception e) {
            conn.rollback();
            throw  new BaseException(e.getMessage());
        } finally {
            DbUtils.closeQuietly(conn);
        }
    }



}
