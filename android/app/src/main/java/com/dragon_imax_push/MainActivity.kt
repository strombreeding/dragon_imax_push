package com.dragon_imax_push

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle
import com.zoontek.rnbootsplash.RNBootSplash
//
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.graphics.Color
import android.os.Build

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "dragon_imax_push"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    RNBootSplash.init(this, R.style.BootTheme) // ⬅️ initialize the splash screen
    super.onCreate(savedInstanceState) // super.onCreate(null) with react-native-screens

  }

  // 실패 코드
//  private fun createNotificationChannel() {
//    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//      val name = "Channel Name"
//      val descriptionText = "Channel Description"
//      val importance = NotificationManager.IMPORTANCE_HIGH // 중요도 설정
//      val channel = NotificationChannel("important_channel", name, importance)
//      channel.description = descriptionText
//      val notificationManager: NotificationManager = getSystemService(NotificationManager::class.java)
//      notificationManager.createNotificationChannel(channel)
//    }
//  }

  //성공 코드
  private fun createNotificationChannel(context: Context) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channelId = "notify" // 채널 ID
      val channelName = "알림 상세 설정" // 채널 이름
      val channelDescription = "팝업 알림을 체크 하는 것을 추천 합니다." // 채널 설명
      val importance = NotificationManager.IMPORTANCE_HIGH // 알림 중요도 설정

      // 채널 생성
      val channel = NotificationChannel(channelId, channelName, importance).apply {
        description = channelDescription

        // 라이트 설정
        enableLights(true)
        lightColor = Color.GREEN

      }

      val notificationManager: NotificationManager =
              context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      notificationManager.createNotificationChannel(channel)
    }
  }
}
