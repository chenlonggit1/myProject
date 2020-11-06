package com.kys.common.utility;

import android.app.Activity;
import android.app.Application;
import android.content.SharedPreferences;

public class UserDefault {
    private static final String STORAGE_NAME = "kys_storage";

    private static UserDefault _instance = null;
    private SharedPreferences sharedPreferences = null;

    private UserDefault() {
    }

    public static synchronized UserDefault getInstance() {
        if (_instance == null)
            _instance = new UserDefault();
        return _instance;
    }

    public void init(Activity activity) {
        this.sharedPreferences = activity.getSharedPreferences(STORAGE_NAME, Activity.MODE_PRIVATE);
    }

    public void init(Application application) {
        this.sharedPreferences = application.getSharedPreferences(STORAGE_NAME, Activity.MODE_PRIVATE);
    }

    public int getIntegerForKey(String key, int def) {
        return this.sharedPreferences.getInt(key, def);
    }

    public void setIntegerForKey(String key, int value) {
        SharedPreferences.Editor editor = this.sharedPreferences.edit();
        editor.putInt(key, value);
        editor.commit();
    }

    public String getStringForKey(String key, String def) {
        return this.sharedPreferences.getString(key, def);
    }

    public void setStringForKey(String key, String value) {
        SharedPreferences.Editor editor = this.sharedPreferences.edit();
        editor.putString(key, value);
        editor.commit();
    }

    public boolean getBooleanForKey(String key, boolean def) {
        return this.sharedPreferences.getBoolean(key, def);
    }

    public void setBooleanForKey(String key, boolean value) {
        SharedPreferences.Editor editor = this.sharedPreferences.edit();
        editor.putBoolean(key, value);
        editor.commit();
    }

}
