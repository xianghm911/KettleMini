package com.winning.kettleMini.jdbc;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import com.winning.kettleMini.utils.ResourceUtils;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;

public class ConnectionManager {

    public static Map<String, String> configs = ResourceUtils.getResource("resourcekt").getMap();

    public static ComboPooledDataSource dataSource;
    static {
        try {
            dataSource = new ComboPooledDataSource();
            dataSource.setUser(configs.get("db.user"));
            dataSource.setPassword(configs.get("db.password"));
            dataSource.setJdbcUrl(configs.get("db.url"));
            dataSource.setDriverClass(configs.get("db.driverClass"));
            dataSource.setInitialPoolSize(10);
            dataSource.setMinPoolSize(5);
            dataSource.setMaxPoolSize(50);
            dataSource.setMaxStatements(100);
            dataSource.setMaxIdleTime(60);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    /**
     * 从连接池中获取数据源链接
     * @return Connection 数据源链接
     */
    public static Connection getConnection() {
        Connection conn = null;
        if (null != dataSource) {
            try {
                conn = dataSource.getConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return conn;
    }

}
