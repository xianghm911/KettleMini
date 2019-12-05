package com.winning.kettleMini.utils;

import com.sun.org.apache.xerces.internal.impl.dv.util.HexBin;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.Reader;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.lang.management.ManagementFactory;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import javax.servlet.GenericServlet;

public class Utils
{
    public static final int DEFAULT_BUFFER_SIZE = 4096;
    private static Date startTime;

    public static String read(InputStream in)
    {
        InputStreamReader reader;
        try
        {
            reader = new InputStreamReader(in, "UTF-8");
        }
        catch (UnsupportedEncodingException e)
        {
            throw new IllegalStateException(e.getMessage(), e);
        }
        return read(reader);
    }

    public static String readFromResource(String resource)
            throws IOException
    {
        InputStream in = null;
        try
        {
            in = Thread.currentThread().getContextClassLoader().getResourceAsStream(resource);
            if (in == null) {
                in = Utils.class.getResourceAsStream(resource);
            }
            if (in == null) {
                return null;
            }
            String text = read(in);
            return text;
        }
        finally
        {
            in.close();
        }
    }

    public static byte[] readByteArrayFromResource(String resource)
            throws IOException
    {
        InputStream in = null;
        try
        {
            in = Thread.currentThread().getContextClassLoader().getResourceAsStream(resource);
            byte[] arrayOfByte;
            if (in == null) {
                return null;
            }
            return readByteArray(in);
        }
        finally
        {
            in.close();
        }
    }

    public static byte[] readByteArray(InputStream input)
            throws IOException
    {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        copy(input, output);
        return output.toByteArray();
    }

    public static long copy(InputStream input, OutputStream output)
            throws IOException
    {
        int EOF = -1;

        byte[] buffer = new byte[4096];

        long count = 0L;
        int n = 0;
        while (-1 != (n = input.read(buffer)))
        {
            output.write(buffer, 0, n);
            count += n;
        }
        return count;
    }

    public static String read(Reader reader)
    {
        try
        {
            StringWriter writer = new StringWriter();

            char[] buffer = new char[4096];
            int n = 0;
            while (-1 != (n = reader.read(buffer))) {
                writer.write(buffer, 0, n);
            }
            return writer.toString();
        }
        catch (IOException ex)
        {
            throw new IllegalStateException("read error", ex);
        }
    }

    public static String read(Reader reader, int length)
    {
        try
        {
            char[] buffer = new char[length];

            int offset = 0;
            int rest = length;
            int len;
            while ((len = reader.read(buffer, offset, rest)) != -1)
            {
                rest -= len;
                offset += len;
                if (rest == 0) {
                    break;
                }
            }
            return new String(buffer, 0, length - rest);
        }
        catch (IOException ex)
        {
            throw new IllegalStateException("read error", ex);
        }
    }

    public static String toString(Date date)
    {
        if (date == null) {
            return null;
        }
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return format.format(date);
    }

    public static String getStackTrace(Throwable ex)
    {
        StringWriter buf = new StringWriter();
        ex.printStackTrace(new PrintWriter(buf));

        return buf.toString();
    }

    public static String toString(StackTraceElement[] stackTrace)
    {
        StringBuilder buf = new StringBuilder();
        for (StackTraceElement item : stackTrace)
        {
            buf.append(item.toString());
            buf.append("\n");
        }
        return buf.toString();
    }

    public static Boolean getBoolean(Properties properties, String key)
    {
        String property = properties.getProperty(key);
        if ("true".equals(property)) {
            return Boolean.TRUE;
        }
        if ("false".equals(property)) {
            return Boolean.FALSE;
        }
        return null;
    }

    public static Boolean getBoolean(GenericServlet servlet, String key)
    {
        String property = servlet.getInitParameter(key);
        if ("true".equals(property)) {
            return Boolean.TRUE;
        }
        if ("false".equals(property)) {
            return Boolean.FALSE;
        }
        return null;
    }

    public static Integer getInteger(Properties properties, String key)
    {
        String property = properties.getProperty(key);
        if (property == null) {
            return null;
        }
        try
        {
            return Integer.valueOf(Integer.parseInt(property));
        }
        catch (NumberFormatException ex) {}
        return null;
    }

    public static Long getLong(Properties properties, String key)
    {
        String property = properties.getProperty(key);
        if (property == null) {
            return null;
        }
        try
        {
            return Long.valueOf(Long.parseLong(property));
        }
        catch (NumberFormatException ex) {}
        return null;
    }

    public static Class<?> loadClass(String className)
    {
        Class<?> clazz = null;
        if (className == null) {
            return null;
        }
        try
        {
            return Class.forName(className);
        }
        catch (ClassNotFoundException e)
        {
            ClassLoader ctxClassLoader = Thread.currentThread().getContextClassLoader();
            if (ctxClassLoader != null) {
                try
                {
                    clazz = ctxClassLoader.loadClass(className);
                }
                catch (ClassNotFoundException e2) {}
            }
        }
        return clazz;
    }

    public static final Date getStartTime()
    {
        if (startTime == null) {
            startTime = new Date(ManagementFactory.getRuntimeMXBean().getStartTime());
        }
        return startTime;
    }

    public static long murmurhash2_64(String text)
    {
        byte[] bytes = text.getBytes();
        return murmurhash2_64(bytes, bytes.length, -512093083);
    }

    public static long murmurhash2_64(byte[] data, int length, int seed)
    {
        long m = -4132994306676758123L;
        int r = 47;

        long h = seed & 0xFFFFFFFF ^ length * -4132994306676758123L;

        int length8 = length / 8;
        for (int i = 0; i < length8; i++)
        {
            int i8 = i * 8;
            long k = (data[(i8 + 0)] & 0xFF) + ((data[(i8 + 1)] & 0xFF) << 8) + ((data[(i8 + 2)] & 0xFF) << 16) + ((data[(i8 + 3)] & 0xFF) << 24) + ((data[(i8 + 4)] & 0xFF) << 32) + ((data[(i8 + 5)] & 0xFF) << 40) + ((data[(i8 + 6)] & 0xFF) << 48) + ((data[(i8 + 7)] & 0xFF) << 56);








            k *= -4132994306676758123L;
            k ^= k >>> 47;
            k *= -4132994306676758123L;

            h ^= k;
            h *= -4132994306676758123L;
        }
        switch (length % 8)
        {
            case 7:
                h ^= (data[((length & 0xFFFFFFF8) + 6)] & 0xFF) << 48;
            case 6:
                h ^= (data[((length & 0xFFFFFFF8) + 5)] & 0xFF) << 40;
            case 5:
                h ^= (data[((length & 0xFFFFFFF8) + 4)] & 0xFF) << 32;
            case 4:
                h ^= (data[((length & 0xFFFFFFF8) + 3)] & 0xFF) << 24;
            case 3:
                h ^= (data[((length & 0xFFFFFFF8) + 2)] & 0xFF) << 16;
            case 2:
                h ^= (data[((length & 0xFFFFFFF8) + 1)] & 0xFF) << 8;
            case 1:
                h ^= data[(length & 0xFFFFFFF8)] & 0xFF;
                h *= -4132994306676758123L;
        }
        h ^= h >>> 47;
        h *= -4132994306676758123L;
        h ^= h >>> 47;

        return h;
    }

    public static byte[] md5Bytes(String text)
    {
        MessageDigest msgDigest = null;
        try
        {
            msgDigest = MessageDigest.getInstance("MD5");
        }
        catch (NoSuchAlgorithmException e)
        {
            throw new IllegalStateException("System doesn't support MD5 algorithm.");
        }
        msgDigest.update(text.getBytes());

        byte[] bytes = msgDigest.digest();

        return bytes;
    }

    public static String md5(String text)
    {
        byte[] bytes = md5Bytes(text);
        return HexBin.encode(bytes);
    }

    public static void putLong(byte[] b, int off, long val)
    {
        b[(off + 7)] = ((byte)(int)(val >>> 0));
        b[(off + 6)] = ((byte)(int)(val >>> 8));
        b[(off + 5)] = ((byte)(int)(val >>> 16));
        b[(off + 4)] = ((byte)(int)(val >>> 24));
        b[(off + 3)] = ((byte)(int)(val >>> 32));
        b[(off + 2)] = ((byte)(int)(val >>> 40));
        b[(off + 1)] = ((byte)(int)(val >>> 48));
        b[(off + 0)] = ((byte)(int)(val >>> 56));
    }
}
