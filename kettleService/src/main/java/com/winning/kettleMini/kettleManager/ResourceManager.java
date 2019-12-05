package com.winning.kettleMini.kettleManager;

import com.winning.kettleMini.jdbc.ConnectionManager;

public class ResourceManager extends ConnectionManager {

    /**
     * kettle文件路径
     */
    public static String KETTLE_FILE_PATH = configs.get("KETTLE_FILE_PATH");

    /**
     * kettle日誌文件路径
     */
    public static String KETTLE_FILE_LOG_PATH = configs.get("KETTLE_FILE_LOG_PATH");


}
