package org.cocos2dx.javascript;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import android.Manifest;
import android.annotation.TargetApi;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.os.Build;

public class PermissionUtils {
	/**
	 * 日历
	 */
	public static final int CALENDAR = 10001;

	/**
	 * 相机
	 */
	public static final int CAMERA = 10002;

	/**
	 * 联系人
	 */
	public static final int CONTACTS = 10003;

	/**
	 * 位置
	 */
	public static final int LOCATION = 10004;

	/**
	 * 麦克风
	 */
	public static final int MICROPHONE = 10005;

	/**
	 * 电话
	 */
	public static final int PHONE = 10006;
	/**
	 * 传感器
	 */
	public static final int SENSORS = 10007;

	/**
	 * 短信
	 */
	public static final int SMS = 10008;

	/**
	 * 存储
	 */
	public static final int STORAGE = 10009;

	/**
	 * 安装权限
	 */
	public static final int INSTALL = 10010;

	private PermissinBackListener listener = null;
	private String mes;
	private String permissionStr;
	public List<HashMap<String, String>> list = new ArrayList<HashMap<String, String>>();
	public Context context;
	private int responsCode = -1;

	public PermissionUtils(Context context) {
		this.context = context;
	}

	public void onRequestPermissionsResult(int requestCode,
										   String[] permissions, int[] grantResults) {
		if (grantResults.length == 0 || list.size() == 0) {
			return;
		}
		list.remove(0);
		if (isCanInstall(requestCode)) {
			return;
		}
		if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
			listener.agree(requestCode, responsCode);
			requestPermiss(list);
			return;
		}
		// 如果mes为空，那默认回调主函数
		if (mes == null) {
			listener.refuse(requestCode, responsCode);
		} else {// 如果mes不为空，那显示给用户提示信息
			showAllRefuseDialog(mes);

		}
		requestPermiss(list);

	}

	public void requestPermiss(List<HashMap<String, String>> list) {
		if (list.size() <= 0) {
			return;
		}
		HashMap<String, String> map = list.get(0);
		int requestCode = Integer.parseInt(map.get("per"));
		try {
			responsCode = Integer.parseInt(map.get("responsCode"));
		} catch (NumberFormatException e) {
			e.printStackTrace();
		}
		this.mes = map.get("mes");
		if (getAndroidOSVersion() <= 22) {// android
			// SDK版本低于22或者API小于6的，都不用调用之后的方法
			listener.agree(requestCode, responsCode);
			this.list.clear();
			return;
		}
		switch (requestCode) {
			case CALENDAR:
				permissionStr = Manifest.permission.READ_CALENDAR;
				break;
			case CAMERA:
				permissionStr = Manifest.permission.CAMERA;
				break;
			case CONTACTS:
				permissionStr = Manifest.permission.READ_CONTACTS;
				break;
			case LOCATION:
				permissionStr = Manifest.permission.ACCESS_FINE_LOCATION;
				break;
			case MICROPHONE:
				permissionStr = Manifest.permission.RECORD_AUDIO;
				break;
			case PHONE:
				permissionStr = Manifest.permission.READ_PHONE_STATE;
				break;
			case SENSORS:
				permissionStr = Manifest.permission.BODY_SENSORS;
				break;
			case SMS:
				permissionStr = Manifest.permission.SEND_SMS;
				break;
			case STORAGE:
				permissionStr = Manifest.permission.WRITE_EXTERNAL_STORAGE;
				break;
			case INSTALL:
				permissionStr = Manifest.permission.REQUEST_INSTALL_PACKAGES;
				break;
			default:
				break;
		}
		listener.myRequestPermissions(new String[]{permissionStr},
				requestCode);
	}

	/**
	 * @param requestCode 申请的权限类型
	 * @param responsCode 申请权限成功/拒绝后过滤标志
	 * @param mes         权限被拒绝后显示的信息
	 */
	public void getPer(int requestCode, int responsCode, String mes) {
		HashMap<String, String> map = new HashMap<String, String>();
		map.put("per", requestCode + "");
		map.put("responsCode", responsCode + "");
		map.put("mes", mes);
		list.add(map);
		requestPermiss(list);
	}

	//是否是判断版本26以上的安装
	@TargetApi(Build.VERSION_CODES.O)
	private boolean isCanInstall(int requestCode) {
		// SDK版本高于或等于26（8.0）的，需要触发安装权限
		if (getAndroidOSVersion() >= 26 && requestCode == INSTALL) {
			//安装权限是否已有
			boolean isHave = context.getPackageManager().canRequestPackageInstalls();
			if (isHave) {
				listener.agree(requestCode, responsCode);
			} else {
				listener.refuse(requestCode,responsCode);
			}
			requestPermiss(list);
			return true;
		}
		return false;
	}

	public void onActivityResult(int requestCode, int resultCode) {
		switch (requestCode) {
			case INSTALL:
				getPer(requestCode, resultCode, mes);
				break;
		}
	}

	/**
	 * 显示用户点击拒绝并且勾选“不再提醒”后，显示的对话框 mes 提示用户什么权限被关闭，请主动去设置中开启
	 */
	private void showAllRefuseDialog(String mes) {
		AlertDialog dialog = new AlertDialog.Builder(context).setMessage(mes)
				.setPositiveButton("确定", new DialogInterface.OnClickListener() {
					@Override
					public void onClick(DialogInterface dialog, int which) {
						dialog.cancel();
					}
				}).create();
		dialog.show();
	}

	public void setPermissinBackListener(PermissinBackListener listener) {
		this.listener = listener;
	}

	private int getAndroidOSVersion() {
		int osVersion;
		try {
			osVersion = android.os.Build.VERSION.SDK_INT;
		} catch (NumberFormatException e) {
			osVersion = 0;
		}

		return osVersion;
	}

	// 权限同意
	public interface PermissinBackListener {
		/**
		 * 权限同意 requestCode 过滤条件 responsCode返回之后，判断调用地方
		 */
		void agree(int requestCode, int responsCode);

		/**
		 * 权限拒绝 requestCode 过滤条件 responsCode返回之后，判断调用地方
		 */
		void refuse(int requestCode, int responsCode);

		/**
		 * 调用权限申请
		 *
		 * @param permission
		 * @param requestCode
		 */
		void myRequestPermissions(String[] permission, int requestCode);

	}
}

