import UIKit
import WebKit
import Capacitor

final class NativeBridgeViewController: CAPBridgeViewController {
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return .allButUpsideDown
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        bridge?.webView?.isOpaque = true
        bridge?.webView?.backgroundColor = .black
        bridge?.webView?.scrollView.backgroundColor = .black
        bridge?.webView?.scrollView.showsVerticalScrollIndicator = false
        bridge?.webView?.scrollView.showsHorizontalScrollIndicator = false
        bridge?.webView?.scrollView.bounces = false
        bridge?.webView?.scrollView.scrollsToTop = false
        navigationController?.setNavigationBarHidden(true, animated: false)

        // NOTE: Cache clearing disabled to avoid memory spikes on launch.
    }
}
