import UIKit

final class LoginViewController: UIViewController {
    private let titleLabel = UILabel()
    private let subtitleLabel = UILabel()
    private let emailField = UITextField()
    private let passwordField = UITextField()
    private let loginButton = UIButton(type: .system)
    private let registerButton = UIButton(type: .system)

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor.systemBackground
        title = "登录"
        buildUI()
    }

    private func buildUI() {
        titleLabel.text = "欢迎回来"
        titleLabel.font = UIFont.systemFont(ofSize: 24, weight: .black)
        subtitleLabel.text = "登录后同步收藏与学习进度"
        subtitleLabel.font = UIFont.systemFont(ofSize: 13, weight: .medium)
        subtitleLabel.textColor = UIColor.secondaryLabel

        [emailField, passwordField].forEach { field in
            field.borderStyle = .roundedRect
            field.backgroundColor = UIColor.secondarySystemBackground
            field.layer.cornerRadius = 12
            field.layer.borderWidth = 1
            field.layer.borderColor = UIColor.systemGray5.cgColor
            field.heightAnchor.constraint(equalToConstant: 44).isActive = true
        }
        emailField.placeholder = "邮箱 / 手机号"
        passwordField.placeholder = "密码"
        passwordField.isSecureTextEntry = true

        loginButton.setTitle("登录", for: .normal)
        loginButton.backgroundColor = UIColor.appOrange
        loginButton.setTitleColor(.white, for: .normal)
        loginButton.titleLabel?.font = UIFont.systemFont(ofSize: 15, weight: .bold)
        loginButton.layer.cornerRadius = 16
        loginButton.heightAnchor.constraint(equalToConstant: 48).isActive = true

        registerButton.setTitle("注册账号", for: .normal)
        registerButton.setTitleColor(UIColor.appOrange, for: .normal)
        registerButton.titleLabel?.font = UIFont.systemFont(ofSize: 14, weight: .semibold)
        registerButton.heightAnchor.constraint(equalToConstant: 36).isActive = true

        let stack = UIStackView(arrangedSubviews: [
            titleLabel,
            subtitleLabel,
            emailField,
            passwordField,
            loginButton,
            registerButton
        ])
        stack.axis = .vertical
        stack.spacing = 12
        stack.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(stack)

        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor, constant: 20),
            stack.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -20),
            stack.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 24)
        ])
    }
}
