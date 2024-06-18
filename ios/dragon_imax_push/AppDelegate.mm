#import "AppDelegate.h"
#import  "RNBootSplash.h"
#import <React/RCTBundleURLProvider.h>
#import <Firebase.h>

@implementation AppDelegate

- ( void ) customRootView : (RCTRootView *) rootView {
  [RNBootSplash initWithStoryboard: @"BootSplash"  rootView: rootView]; // ⬅️ 스플래시 화면 초기화
}


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  self.moduleName = @"dragon_imax_push";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
