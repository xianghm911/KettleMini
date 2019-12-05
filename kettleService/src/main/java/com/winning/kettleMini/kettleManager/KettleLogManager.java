package com.winning.kettleMini.kettleManager;


import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class KettleLogManager {

    private static final String log_root_path = ResourceManager.KETTLE_FILE_LOG_PATH;

    public static void writeLogs(String jobId,String logStr){
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH )+1;
        String fullPath = log_root_path+"\\"+jobId+"\\"+year+"\\"+month+"\\"+simpleDateFormat.format(new Date())+".txt";
        String path1 = log_root_path+"\\"+jobId;
        String path2 = log_root_path+"\\"+jobId+"\\"+year;
        String path3 = log_root_path+"\\"+jobId+"\\"+year+"\\"+month;
        mkDirs(log_root_path);
        mkDirs(path1);
        mkDirs(path2);
        mkDirs(path3);
        File file = mkFiles(fullPath);
        FileOutputStream outStream = null;
        try {
            outStream =  new FileOutputStream(file,true);
            outStream.write(logStr.getBytes());
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            if(outStream != null){
                try {
                    outStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }


    public static String readLogs(String jobId){
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH )+1;
        String fullPath = log_root_path+"\\"+jobId+"\\"+year+"\\"+month+"\\"+simpleDateFormat.format(new Date())+".txt";
        StringBuilder result = new StringBuilder();
        File logFile = new File(fullPath);

        if(!logFile.exists()){
            return "";
        }

        try{
            BufferedReader br = new BufferedReader(new FileReader(logFile));//构造一个BufferedReader类来读取文件
            String s = null;
            while((s = br.readLine())!=null){//使用readLine方法，一次读一行
                result.append(System.lineSeparator()+s+"<br>");
            }
            br.close();
        }catch(Exception e){
            e.printStackTrace();
        }
        return result.toString();
    }




    public static void mkDirs(String path){
        File logFile = new File(path);
        if(!logFile.exists()){
            logFile.mkdirs();
        }
    }

    public static File mkFiles(String path){
        File logFile = new File(path);
        if(!logFile.exists()){
            try {
                logFile.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return logFile;
    }

    public static void main(String[] args){
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH )+1;
        System.out.println(year);
        System.out.println(month);
    }




}
