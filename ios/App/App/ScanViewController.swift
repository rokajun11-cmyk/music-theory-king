import UIKit
import PhotosUI

final class ScanViewController: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate, PHPickerViewControllerDelegate {
    private let scrollView = UIScrollView()
    private let contentStack = UIStackView()

    private let subtitleLabel = UILabel()

    private let summaryCard = UIView()
    private let titleLabel = UILabel()
    private let metaLabel = UILabel()
    private let confidenceLabel = UILabel()

    private let analysisStack = UIStackView()
    private let chordTagStack = UIStackView()

    private let referenceImageView = UIImageView()
    private let scoreContainer = UIStackView()

    private let scanButton: UIButton = {
        let button = UIButton(type: .system)
        button.translatesAutoresizingMaskIntoConstraints = false
        button.backgroundColor = UIColor.appOrange
        button.tintColor = .white
        button.layer.cornerRadius = 28
        button.layer.shadowColor = UIColor.black.cgColor
        button.layer.shadowOpacity = 0.16
        button.layer.shadowRadius = 14
        button.layer.shadowOffset = CGSize(width: 0, height: 8)
        if let image = UIImage(systemName: "camera.viewfinder") {
            button.setImage(image, for: .normal)
        }
        return button
    }()

    private var chordInfoViews: [ChordTokenView] = []
    private weak var centeredTitleLabel: UILabel?
    private var isMuted = false
    private var muteItem: UIBarButtonItem?
    private var languageItem: UIBarButtonItem?
    private let languageOrder = ["中", "En", "JP"]
    private var languageIndex = 0

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 11/255, green: 11/255, blue: 15/255, alpha: 1)
        configureNavBar()
        configureNavItems()
        buildLayout()
        setupScanButton()
        renderMockData()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        installCenteredTitle()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        centeredTitleLabel?.removeFromSuperview()
        centeredTitleLabel = nil
    }

    private func configureNavBar() {
        navigationItem.largeTitleDisplayMode = .never
        let appearance = UINavigationBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor.black
        appearance.titleTextAttributes = [
            .foregroundColor: UIColor.white,
            .font: UIFont.systemFont(ofSize: 17, weight: .semibold)
        ]
        appearance.shadowColor = .clear
        navigationController?.navigationBar.standardAppearance = appearance
        navigationController?.navigationBar.scrollEdgeAppearance = appearance
        navigationController?.navigationBar.compactAppearance = appearance
        navigationController?.navigationBar.tintColor = UIColor.appOrange
    }

    private func configureNavItems() {
        let languageItem = makeCircleItem(
            title: languageOrder[languageIndex],
            systemImage: nil,
            action: #selector(changeLanguage)
        )
        self.languageItem = languageItem
        let muteItem = makeCircleItem(
            title: nil,
            systemImage: "speaker.wave.2",
            action: #selector(toggleMute)
        )
        self.muteItem = muteItem
        let spacer = UIBarButtonItem(barButtonSystemItem: .fixedSpace, target: nil, action: nil)
        spacer.width = 8
        navigationItem.rightBarButtonItems = [muteItem, spacer, languageItem]
    }

    private func installCenteredTitle() {
        guard let navBar = navigationController?.navigationBar else { return }
        navigationItem.titleView = UIView()
        centeredTitleLabel?.removeFromSuperview()
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.text = title
        label.font = UIFont.systemFont(ofSize: 17, weight: .semibold)
        label.textColor = UIColor.white
        label.textAlignment = .center
        navBar.addSubview(label)
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: navBar.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: navBar.centerYAnchor)
        ])
        centeredTitleLabel = label
    }

    private func buildLayout() {
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.showsVerticalScrollIndicator = false
        scrollView.showsHorizontalScrollIndicator = false
        scrollView.backgroundColor = view.backgroundColor
        view.addSubview(scrollView)
        NSLayoutConstraint.activate([
            scrollView.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor, constant: 16),
            scrollView.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -16),
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 12),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        contentStack.axis = .vertical
        contentStack.spacing = 16
        contentStack.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentStack)
        NSLayoutConstraint.activate([
            contentStack.leadingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.leadingAnchor),
            contentStack.trailingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.trailingAnchor),
            contentStack.topAnchor.constraint(equalTo: scrollView.contentLayoutGuide.topAnchor),
            contentStack.bottomAnchor.constraint(equalTo: scrollView.contentLayoutGuide.bottomAnchor),
            contentStack.widthAnchor.constraint(equalTo: scrollView.frameLayoutGuide.widthAnchor)
        ])

        subtitleLabel.text = "扫描后生成电子化谱面与分析"
        subtitleLabel.font = UIFont.systemFont(ofSize: 13, weight: .medium)
        subtitleLabel.textColor = UIColor(red: 107/255, green: 114/255, blue: 128/255, alpha: 1)

        let headerStack = UIStackView(arrangedSubviews: [subtitleLabel])
        headerStack.axis = .vertical
        headerStack.spacing = 6
        contentStack.addArrangedSubview(headerStack)

        summaryCard.layer.cornerRadius = 20
        summaryCard.layer.borderWidth = 1
        summaryCard.layer.borderColor = UIColor(red: 42/255, green: 42/255, blue: 47/255, alpha: 1).cgColor
        summaryCard.backgroundColor = UIColor(red: 26/255, green: 26/255, blue: 31/255, alpha: 1)

        let summaryStack = UIStackView()
        summaryStack.axis = .vertical
        summaryStack.spacing = 10
        summaryStack.translatesAutoresizingMaskIntoConstraints = false
        summaryCard.addSubview(summaryStack)
        NSLayoutConstraint.activate([
            summaryStack.leadingAnchor.constraint(equalTo: summaryCard.leadingAnchor, constant: 16),
            summaryStack.trailingAnchor.constraint(equalTo: summaryCard.trailingAnchor, constant: -16),
            summaryStack.topAnchor.constraint(equalTo: summaryCard.topAnchor, constant: 16),
            summaryStack.bottomAnchor.constraint(equalTo: summaryCard.bottomAnchor, constant: -16)
        ])

        titleLabel.font = UIFont.systemFont(ofSize: 18, weight: .bold)
        titleLabel.textColor = UIColor(white: 0.92, alpha: 1)
        metaLabel.font = UIFont.systemFont(ofSize: 12, weight: .medium)
        metaLabel.textColor = UIColor(red: 107/255, green: 114/255, blue: 128/255, alpha: 1)
        confidenceLabel.font = UIFont.systemFont(ofSize: 16, weight: .heavy)
        confidenceLabel.textColor = UIColor.appOrange

        let headerRow = UIStackView(arrangedSubviews: [titleLabel, UIView(), confidenceLabel])
        headerRow.axis = .horizontal
        headerRow.alignment = .center
        summaryStack.addArrangedSubview(headerRow)
        summaryStack.addArrangedSubview(metaLabel)

        let analysisRow = UIStackView()
        analysisRow.axis = .vertical
        analysisRow.alignment = .fill
        analysisRow.spacing = 12

        analysisStack.axis = .vertical
        analysisStack.spacing = 6
        chordTagStack.axis = .vertical
        chordTagStack.spacing = 8
        chordTagStack.alignment = .fill

        analysisRow.addArrangedSubview(analysisStack)
        analysisRow.addArrangedSubview(chordTagStack)
        summaryStack.addArrangedSubview(analysisRow)

        contentStack.addArrangedSubview(summaryCard)

        let referenceCard = buildSectionCard(title: "参考谱面")
        referenceImageView.image = UIImage(named: "AllOfMeReference")
        referenceImageView.contentMode = .scaleAspectFit
        referenceImageView.clipsToBounds = true
        referenceImageView.layer.cornerRadius = 16
        referenceCard.addSubview(referenceImageView)
        referenceImageView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            referenceImageView.leadingAnchor.constraint(equalTo: referenceCard.leadingAnchor, constant: 16),
            referenceImageView.trailingAnchor.constraint(equalTo: referenceCard.trailingAnchor, constant: -16),
            referenceImageView.topAnchor.constraint(equalTo: referenceCard.topAnchor, constant: 40),
            referenceImageView.bottomAnchor.constraint(equalTo: referenceCard.bottomAnchor, constant: -12),
            referenceImageView.heightAnchor.constraint(equalTo: referenceImageView.widthAnchor, multiplier: 1.414)
        ])

        contentStack.addArrangedSubview(referenceCard)

        let scoreCard = buildSectionCard(title: "电子化谱面")
        scoreContainer.axis = .vertical
        scoreContainer.spacing = 10
        scoreContainer.translatesAutoresizingMaskIntoConstraints = false
        scoreCard.addSubview(scoreContainer)
        NSLayoutConstraint.activate([
            scoreContainer.leadingAnchor.constraint(equalTo: scoreCard.leadingAnchor, constant: 16),
            scoreContainer.trailingAnchor.constraint(equalTo: scoreCard.trailingAnchor, constant: -16),
            scoreContainer.topAnchor.constraint(equalTo: scoreCard.topAnchor, constant: 44),
            scoreContainer.bottomAnchor.constraint(equalTo: scoreCard.bottomAnchor, constant: -16)
        ])
        contentStack.addArrangedSubview(scoreCard)
    }

    @objc private func toggleMute() {
        isMuted.toggle()
        let imageName = isMuted ? "speaker.slash" : "speaker.wave.2"
        updateCircleItem(muteItem, title: nil, systemImage: imageName)
    }

    @objc private func changeLanguage() {
        languageIndex = (languageIndex + 1) % languageOrder.count
        updateCircleItem(languageItem, title: languageOrder[languageIndex], systemImage: nil)
    }

    private func makeCircleItem(title: String?, systemImage: String?, action: Selector) -> UIBarButtonItem {
        let button = UIButton(type: .system)
        button.translatesAutoresizingMaskIntoConstraints = false
        button.backgroundColor = UIColor(red: 42/255, green: 42/255, blue: 47/255, alpha: 1)
        button.layer.cornerRadius = 16
        button.clipsToBounds = true
        button.widthAnchor.constraint(equalToConstant: 32).isActive = true
        button.heightAnchor.constraint(equalToConstant: 32).isActive = true
        button.titleLabel?.font = UIFont.systemFont(ofSize: 12, weight: .semibold)
        button.setTitleColor(UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1), for: .normal)
        button.tintColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1)
        if let title {
            button.setTitle(title, for: .normal)
        } else if let systemImage {
            let config = UIImage.SymbolConfiguration(pointSize: 14, weight: .medium)
            button.setImage(UIImage(systemName: systemImage, withConfiguration: config), for: .normal)
        }
        button.addTarget(self, action: action, for: .touchUpInside)
        return UIBarButtonItem(customView: button)
    }

    private func updateCircleItem(_ item: UIBarButtonItem?, title: String?, systemImage: String?) {
        guard let button = item?.customView as? UIButton else { return }
        if let title {
            button.setImage(nil, for: .normal)
            button.setTitle(title, for: .normal)
        } else if let systemImage {
            button.setTitle(nil, for: .normal)
            button.setImage(UIImage(systemName: systemImage), for: .normal)
        }
    }

    private func buildSectionCard(title: String) -> UIView {
        let card = PhraseCardView()
        card.layer.cornerRadius = 20
        card.layer.borderWidth = 1
        card.layer.borderColor = UIColor(red: 42/255, green: 42/255, blue: 47/255, alpha: 1).cgColor
        card.backgroundColor = UIColor(red: 26/255, green: 26/255, blue: 31/255, alpha: 1)

        let label = UILabel()
        label.text = title
        label.font = UIFont.systemFont(ofSize: 12, weight: .bold)
        label.textColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1)
        label.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(label)
        NSLayoutConstraint.activate([
            label.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 16),
            label.topAnchor.constraint(equalTo: card.topAnchor, constant: 16)
        ])
        return card
    }

    private func renderMockData() {
        titleLabel.text = "All of Me"
        metaLabel.text = "C Major • AABA form • 8 bars preview"
        confidenceLabel.text = "94%"

        analysisStack.arrangedSubviews.forEach { $0.removeFromSuperview() }
        ["开头快速进入二级属链", "桥段以循环属推进张力", "乐句与和弦分析分层展示"].forEach { text in
            let label = UILabel()
            label.font = UIFont.systemFont(ofSize: 12, weight: .medium)
            label.textColor = UIColor(red: 107/255, green: 114/255, blue: 128/255, alpha: 1)
            label.text = "• \(text)"
            analysisStack.addArrangedSubview(label)
        }

        setDetectedChords(["Cmaj7", "E7", "A7", "Dm7", "E7", "Am7", "D7", "G7", "Cmaj7", "F#dim", "E7b9"])

        scoreContainer.arrangedSubviews.forEach { $0.removeFromSuperview() }
        addPhraseCard(
            title: "A1",
            analysis: "ii–V–I in C major, dominant chain",
            chords: ["Cmaj7", "E7", "A7"],
            notes: [
                NoteMarker(position: 0.1, label: "E"),
                NoteMarker(position: 0.42, label: "G"),
                NoteMarker(position: 0.65, label: "C"),
                NoteMarker(position: 0.5, label: "B"),
                NoteMarker(position: 0.28, label: "D")
            ]
        )
        addPhraseCard(
            title: "A2",
            analysis: "Minor tonic area, melodic sequence",
            chords: ["Dm7", "E7", "Am7"],
            notes: [
                NoteMarker(position: 0.2, label: "F"),
                NoteMarker(position: 0.35, label: "A"),
                NoteMarker(position: 0.6, label: "C"),
                NoteMarker(position: 0.78, label: "E")
            ]
        )
        addPhraseCard(
            title: "B1",
            analysis: "Bridge with dominant motion",
            chords: ["D7", "G7"],
            notes: [
                NoteMarker(position: 0.18, label: "F#"),
                NoteMarker(position: 0.52, label: "C"),
                NoteMarker(position: 0.7, label: "D")
            ]
        )
        addPhraseCard(
            title: "B2",
            analysis: "Return to tonic",
            chords: ["Cmaj7"],
            notes: [
                NoteMarker(position: 0.12, label: "C"),
                NoteMarker(position: 0.48, label: "E"),
                NoteMarker(position: 0.62, label: "G")
            ]
        )
    }

    private func setDetectedChords(_ chords: [String]) {
        chordTagStack.arrangedSubviews.forEach { $0.removeFromSuperview() }
        let header = UILabel()
        header.text = "检测到的和弦"
        header.font = UIFont.systemFont(ofSize: 11, weight: .bold)
        header.textColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1)
        chordTagStack.addArrangedSubview(header)

        let rows = buildWrappedRows(items: chords.map { buildTag(text: $0) }, maxPerRow: 4)
        rows.forEach { chordTagStack.addArrangedSubview($0) }
    }

    private func buildTag(text: String) -> UILabel {
        let label = UILabel()
        label.text = text
        label.font = UIFont.systemFont(ofSize: 11, weight: .bold)
        label.textColor = UIColor(white: 0.92, alpha: 1)
        label.backgroundColor = UIColor(red: 15/255, green: 15/255, blue: 20/255, alpha: 1)
        label.layer.cornerRadius = 14
        label.layer.borderWidth = 1
        label.layer.borderColor = UIColor(red: 42/255, green: 42/255, blue: 47/255, alpha: 1).cgColor
        label.layer.masksToBounds = true
        label.textAlignment = .center
        label.setContentHuggingPriority(.required, for: .horizontal)
        label.setContentCompressionResistancePriority(.required, for: .horizontal)
        label.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            label.heightAnchor.constraint(equalToConstant: 28),
            label.widthAnchor.constraint(greaterThanOrEqualToConstant: 48)
        ])
        return label
    }

    private func addPhraseCard(title: String, analysis: String, chords: [String], notes: [NoteMarker]) {
        let card = PhraseCardView()
        card.layer.cornerRadius = 20
        card.layer.borderWidth = 1
        card.layer.borderColor = UIColor(red: 42/255, green: 42/255, blue: 47/255, alpha: 1).cgColor
        card.backgroundColor = UIColor(red: 26/255, green: 26/255, blue: 31/255, alpha: 1)

        let headerLabel = UILabel()
        headerLabel.text = title
        headerLabel.font = UIFont.systemFont(ofSize: 13, weight: .bold)
        headerLabel.textColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1)

        var chordTokens: [UIView] = []

        let phraseInfo = PhraseInfoView(text: analysis)
        phraseInfo.isHidden = true

        chords.forEach { chord in
            let info = chordInfo(for: chord)
            let token = ChordTokenView(chord: chord, info: info)
            token.onToggle = { [weak self] _ in
                self?.relayoutScore()
            }
            chordInfoViews.append(token)
            chordTokens.append(token)
        }
        let chordRow = buildWrappedStack(items: chordTokens, maxPerRow: 4)

        let staffView = StaffView()
        staffView.noteMarkers = notes
        staffView.translatesAutoresizingMaskIntoConstraints = false

        let stack = UIStackView(arrangedSubviews: [headerLabel, chordRow, staffView, phraseInfo])
        stack.axis = .vertical
        stack.spacing = 10
        stack.translatesAutoresizingMaskIntoConstraints = false
        card.addSubview(stack)
        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: card.leadingAnchor, constant: 16),
            stack.trailingAnchor.constraint(equalTo: card.trailingAnchor, constant: -16),
            stack.topAnchor.constraint(equalTo: card.topAnchor, constant: 14),
            stack.bottomAnchor.constraint(equalTo: card.bottomAnchor, constant: -14),
            staffView.heightAnchor.constraint(equalToConstant: 90)
        ])

        let doubleTap = UITapGestureRecognizer(target: self, action: #selector(phraseDoubleTapped(_:)))
        doubleTap.numberOfTapsRequired = 2
        card.addGestureRecognizer(doubleTap)

        let longPress = UILongPressGestureRecognizer(target: self, action: #selector(phraseLongPressed(_:)))
        longPress.minimumPressDuration = 0.35
        card.addGestureRecognizer(longPress)

        card.accessibilityLabel = title
        card.accessibilityHint = "双击或长按查看乐句解析"
        card.tag = scoreContainer.arrangedSubviews.count
        card.infoView = phraseInfo

        scoreContainer.addArrangedSubview(card)
    }

    @objc private func phraseDoubleTapped(_ sender: UITapGestureRecognizer) {
        togglePhraseInfo(sender.view)
    }

    @objc private func phraseLongPressed(_ sender: UILongPressGestureRecognizer) {
        if sender.state == .began {
            togglePhraseInfo(sender.view)
        }
    }

    private func togglePhraseInfo(_ view: UIView?) {
        guard let card = view as? PhraseCardView,
              let infoView = card.infoView else { return }
        infoView.isHidden.toggle()
        if !infoView.isHidden {
            closeAllChordInfo()
        }
        relayoutScore()
    }

    private func closeAllChordInfo() {
        chordInfoViews.forEach { $0.close() }
    }

    private func relayoutScore() {
        UIView.animate(withDuration: 0.2) {
            self.view.layoutIfNeeded()
        }
    }

    private func buildWrappedStack(items: [UIView], maxPerRow: Int) -> UIStackView {
        let container = UIStackView()
        container.axis = .vertical
        container.spacing = 8
        var currentRow = UIStackView()
        currentRow.axis = .horizontal
        currentRow.spacing = 8
        currentRow.alignment = .top
        currentRow.distribution = .fillProportionally

        for (index, item) in items.enumerated() {
            if index % maxPerRow == 0 && index != 0 {
                container.addArrangedSubview(currentRow)
                currentRow = UIStackView()
                currentRow.axis = .horizontal
                currentRow.spacing = 8
                currentRow.alignment = .top
                currentRow.distribution = .fillProportionally
            }
            currentRow.addArrangedSubview(item)
        }
        container.addArrangedSubview(currentRow)
        return container
    }

    private func buildWrappedRows(items: [UIView], maxPerRow: Int) -> [UIStackView] {
        var rows: [UIStackView] = []
        var currentRow = UIStackView()
        currentRow.axis = .horizontal
        currentRow.spacing = 8
        currentRow.alignment = .center
        currentRow.distribution = .fillProportionally
        for (index, item) in items.enumerated() {
            if index % maxPerRow == 0 && index != 0 {
                rows.append(currentRow)
                currentRow = UIStackView()
                currentRow.axis = .horizontal
                currentRow.spacing = 8
                currentRow.alignment = .center
                currentRow.distribution = .fillProportionally
            }
            currentRow.addArrangedSubview(item)
        }
        rows.append(currentRow)
        return rows
    }

    private func setupScanButton() {
        view.addSubview(scanButton)
        NSLayoutConstraint.activate([
            scanButton.widthAnchor.constraint(equalToConstant: 56),
            scanButton.heightAnchor.constraint(equalToConstant: 56),
            scanButton.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -20),
            scanButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20)
        ])
        scanButton.addTarget(self, action: #selector(showScanOptions), for: .touchUpInside)
    }

    @objc private func showScanOptions() {
        let alert = UIAlertController(title: "导入谱面", message: nil, preferredStyle: .actionSheet)
        if UIImagePickerController.isSourceTypeAvailable(.camera) {
            alert.addAction(UIAlertAction(title: "拍照", style: .default) { [weak self] _ in
                self?.presentCamera()
            })
        }
        alert.addAction(UIAlertAction(title: "从相册选择", style: .default) { [weak self] _ in
            self?.presentPhotoLibrary()
        })
        alert.addAction(UIAlertAction(title: "取消", style: .cancel))

        if let popover = alert.popoverPresentationController {
            popover.sourceView = scanButton
            popover.sourceRect = scanButton.bounds
        }
        present(alert, animated: true)
    }

    private func presentCamera() {
        let picker = UIImagePickerController()
        picker.delegate = self
        picker.sourceType = .camera
        picker.modalPresentationStyle = .fullScreen
        present(picker, animated: true)
    }

    private func presentPhotoLibrary() {
        var configuration = PHPickerConfiguration(photoLibrary: .shared())
        configuration.selectionLimit = 1
        configuration.filter = .images
        let picker = PHPickerViewController(configuration: configuration)
        picker.delegate = self
        present(picker, animated: true)
    }

    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true)
    }

    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        picker.dismiss(animated: true)
        guard let image = info[.originalImage] as? UIImage else { return }
        referenceImageView.image = image
    }

    func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
        picker.dismiss(animated: true)
        guard let provider = results.first?.itemProvider else { return }
        if provider.canLoadObject(ofClass: UIImage.self) {
            provider.loadObject(ofClass: UIImage.self) { [weak self] image, _ in
                guard let self, let uiImage = image as? UIImage else { return }
                DispatchQueue.main.async {
                    self.referenceImageView.image = uiImage
                }
            }
        }
    }

    private func chordInfo(for chord: String) -> ChordInfo {
        switch chord {
        case "Cmaj7":
            return ChordInfo(
                degree: "I",
                function: "Tonic",
                scaleNotes: ["C", "D", "E", "F", "G", "A", "B"],
                chordTones: ["C", "E", "G", "B"],
                extensionTones: ["D", "A"],
                avoidTones: ["F"]
            )
        case "E7":
            return ChordInfo(
                degree: "V/vi",
                function: "Secondary Dominant",
                scaleNotes: ["E", "F#", "G#", "A", "B", "C#", "D"],
                chordTones: ["E", "G#", "B", "D"],
                extensionTones: ["F#", "C#"],
                avoidTones: ["A"]
            )
        case "A7":
            return ChordInfo(
                degree: "V/ii",
                function: "Secondary Dominant",
                scaleNotes: ["A", "B", "C#", "D", "E", "F#", "G"],
                chordTones: ["A", "C#", "E", "G"],
                extensionTones: ["B", "F#"],
                avoidTones: ["D"]
            )
        case "Dm7":
            return ChordInfo(
                degree: "ii",
                function: "Pre-dominant",
                scaleNotes: ["D", "E", "F", "G", "A", "B", "C"],
                chordTones: ["D", "F", "A", "C"],
                extensionTones: ["E", "G"],
                avoidTones: ["B"]
            )
        case "Am7":
            return ChordInfo(
                degree: "vi",
                function: "Tonic",
                scaleNotes: ["A", "B", "C", "D", "E", "F", "G"],
                chordTones: ["A", "C", "E", "G"],
                extensionTones: ["B", "D"],
                avoidTones: ["F"]
            )
        case "D7":
            return ChordInfo(
                degree: "V/V",
                function: "Secondary Dominant",
                scaleNotes: ["D", "E", "F#", "G", "A", "B", "C"],
                chordTones: ["D", "F#", "A", "C"],
                extensionTones: ["E", "B"],
                avoidTones: ["G"]
            )
        case "G7":
            return ChordInfo(
                degree: "V",
                function: "Dominant",
                scaleNotes: ["G", "A", "B", "C", "D", "E", "F"],
                chordTones: ["G", "B", "D", "F"],
                extensionTones: ["A", "E"],
                avoidTones: ["C"]
            )
        default:
            return ChordInfo(
                degree: "I",
                function: "Tonic",
                scaleNotes: ["C", "D", "E", "F", "G", "A", "B"],
                chordTones: ["C", "E", "G", "B"],
                extensionTones: ["D", "A"],
                avoidTones: ["F"]
            )
        }
    }
}

private struct ChordInfo {
    let degree: String
    let function: String
    let scaleNotes: [String]
    let chordTones: Set<String>
    let extensionTones: Set<String>
    let avoidTones: Set<String>
}

private final class ChordTokenView: UIControl {
    private let label = UILabel()
    private let infoView: UIView
    private let diagramView: UIView
    var onToggle: ((Bool) -> Void)?
    var onDiagramToggle: ((Bool) -> Void)?

    private var isOpen = false
    private var isDiagramOpen = false

    init(chord: String, info: ChordInfo) {
        self.infoView = ChordInfoView(info: info)
        self.diagramView = ChordDiagramView(chord: chord)
        super.init(frame: .zero)
        label.text = chord
        label.font = UIFont.systemFont(ofSize: 14, weight: .semibold)
        label.textColor = UIColor(white: 0.92, alpha: 1)

        let stack = UIStackView(arrangedSubviews: [label, infoView, diagramView])
        stack.axis = .vertical
        stack.spacing = 6
        stack.alignment = .leading
        stack.translatesAutoresizingMaskIntoConstraints = false
        addSubview(stack)
        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: leadingAnchor),
            stack.trailingAnchor.constraint(equalTo: trailingAnchor),
            stack.topAnchor.constraint(equalTo: topAnchor),
            stack.bottomAnchor.constraint(equalTo: bottomAnchor)
        ])

        infoView.isHidden = true
        diagramView.isHidden = true
        let doubleTap = UITapGestureRecognizer(target: self, action: #selector(toggleDiagram))
        doubleTap.numberOfTapsRequired = 2
        addGestureRecognizer(doubleTap)
        let longPress = UILongPressGestureRecognizer(target: self, action: #selector(handleLongPress(_:)))
        longPress.minimumPressDuration = 0.35
        addGestureRecognizer(longPress)
        addTarget(self, action: #selector(toggle), for: .touchUpInside)
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    @objc private func toggle() {
        isOpen.toggle()
        infoView.isHidden = !isOpen
        label.textColor = isOpen ? UIColor.appOrange : UIColor(white: 0.92, alpha: 1)
        onToggle?(isOpen)
    }

    func close() {
        guard isOpen else { return }
        isOpen = false
        infoView.isHidden = true
        label.textColor = UIColor(white: 0.92, alpha: 1)
    }

    @objc private func toggleDiagram() {
        isDiagramOpen.toggle()
        diagramView.isHidden = !isDiagramOpen
        onDiagramToggle?(isDiagramOpen)
    }

    @objc private func handleLongPress(_ sender: UILongPressGestureRecognizer) {
        if sender.state == .began {
            toggleDiagram()
        }
    }
}

private final class ChordInfoView: UIView {
    init(info: ChordInfo) {
        super.init(frame: .zero)
        layer.cornerRadius = 12
        backgroundColor = UIColor(red: 15/255, green: 15/255, blue: 20/255, alpha: 1)
        layer.borderWidth = 1
        layer.borderColor = UIColor(red: 42/255, green: 42/255, blue: 47/255, alpha: 1).cgColor

        let degreeLabel = UILabel()
        degreeLabel.font = UIFont.systemFont(ofSize: 12, weight: .semibold)
        degreeLabel.textColor = UIColor(white: 0.92, alpha: 1)
        degreeLabel.text = "\(info.degree)  \(info.function)"

        let scaleLabel = UILabel()
        scaleLabel.font = UIFont.systemFont(ofSize: 12, weight: .medium)
        scaleLabel.attributedText = buildScaleText(info: info)
        scaleLabel.numberOfLines = 0

        let stack = UIStackView(arrangedSubviews: [degreeLabel, scaleLabel])
        stack.axis = .vertical
        stack.spacing = 6
        stack.translatesAutoresizingMaskIntoConstraints = false
        addSubview(stack)
        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 10),
            stack.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -10),
            stack.topAnchor.constraint(equalTo: topAnchor, constant: 8),
            stack.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -8)
        ])
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    private func buildScaleText(info: ChordInfo) -> NSAttributedString {
        let result = NSMutableAttributedString()
        for (index, note) in info.scaleNotes.enumerated() {
            if index > 0 {
                result.append(NSAttributedString(string: " "))
            }
            let attributes: [NSAttributedString.Key: Any]
            if info.avoidTones.contains(note) {
                attributes = [
                    .foregroundColor: UIColor(red: 107/255, green: 114/255, blue: 128/255, alpha: 1),
                    .strikethroughStyle: NSUnderlineStyle.single.rawValue
                ]
            } else if info.chordTones.contains(note) {
                attributes = [.foregroundColor: UIColor.appOrange, .font: UIFont.systemFont(ofSize: 12, weight: .bold)]
            } else if info.extensionTones.contains(note) {
                attributes = [.foregroundColor: UIColor(white: 0.92, alpha: 1), .font: UIFont.systemFont(ofSize: 12, weight: .semibold)]
            } else {
                attributes = [.foregroundColor: UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1), .font: UIFont.systemFont(ofSize: 12, weight: .medium)]
            }
            result.append(NSAttributedString(string: note, attributes: attributes))
        }
        return result
    }
}

private final class PhraseInfoView: UIView {
    private let label = UILabel()

    init(text: String) {
        super.init(frame: .zero)
        layer.cornerRadius = 14
        backgroundColor = UIColor(red: 15/255, green: 15/255, blue: 20/255, alpha: 1)
        layer.borderWidth = 1
        layer.borderColor = UIColor(red: 42/255, green: 42/255, blue: 47/255, alpha: 1).cgColor

        label.text = text
        label.font = UIFont.systemFont(ofSize: 12, weight: .medium)
        label.textColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1)
        label.numberOfLines = 0
        label.translatesAutoresizingMaskIntoConstraints = false
        addSubview(label)
        NSLayoutConstraint.activate([
            label.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 12),
            label.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -12),
            label.topAnchor.constraint(equalTo: topAnchor, constant: 8),
            label.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -8)
        ])
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

private struct NoteMarker {
    let position: CGFloat
    let label: String
}

private final class StaffView: UIView {
    var noteMarkers: [NoteMarker] = [] {
        didSet { setNeedsLayout() }
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        layer.sublayers?.forEach { $0.removeFromSuperlayer() }
        subviews.forEach { $0.removeFromSuperview() }

        let lineCount = 5
        let spacing = bounds.height / 6
        for index in 0..<lineCount {
            let y = spacing + CGFloat(index) * spacing
            let lineLayer = CALayer()
            lineLayer.backgroundColor = UIColor(red: 42/255, green: 42/255, blue: 47/255, alpha: 1).cgColor
            lineLayer.frame = CGRect(x: 0, y: y, width: bounds.width, height: 1)
            layer.addSublayer(lineLayer)
        }

        let noteSize = CGSize(width: 12, height: 8)
        noteMarkers.enumerated().forEach { idx, marker in
            let x = CGFloat(idx) * 28 + 12
            let y = spacing + marker.position * spacing * 4 - noteSize.height / 2
            let dot = NoteDotView(marker: marker)
            dot.frame = CGRect(origin: CGPoint(x: x, y: y), size: noteSize)
            dot.backgroundColor = UIColor(white: 0.95, alpha: 1)
            dot.layer.cornerRadius = noteSize.height / 2
            addSubview(dot)
        }
    }
}

private final class PhraseCardView: UIView {
    var infoView: PhraseInfoView?
}

private final class NoteDotView: UIView {
    private let marker: NoteMarker
    private var infoView: NoteInfoView?

    init(marker: NoteMarker) {
        self.marker = marker
        super.init(frame: .zero)
        isUserInteractionEnabled = true
        let longPress = UILongPressGestureRecognizer(target: self, action: #selector(handleLongPress(_:)))
        longPress.minimumPressDuration = 0.3
        addGestureRecognizer(longPress)
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    @objc private func handleLongPress(_ sender: UILongPressGestureRecognizer) {
        if sender.state == .began {
            toggleInfo()
        }
    }

    private func toggleInfo() {
        if let infoView {
            infoView.removeFromSuperview()
            self.infoView = nil
            return
        }
        let bubble = NoteInfoView(text: marker.label)
        bubble.translatesAutoresizingMaskIntoConstraints = false
        addSubview(bubble)
        NSLayoutConstraint.activate([
            bubble.bottomAnchor.constraint(equalTo: topAnchor, constant: -6),
            bubble.centerXAnchor.constraint(equalTo: centerXAnchor)
        ])
        infoView = bubble
    }
}

private final class NoteInfoView: UIView {
    init(text: String) {
        super.init(frame: .zero)
        layer.cornerRadius = 10
        backgroundColor = UIColor(red: 15/255, green: 15/255, blue: 20/255, alpha: 1)
        layer.borderWidth = 1
        layer.borderColor = UIColor(red: 42/255, green: 42/255, blue: 47/255, alpha: 1).cgColor
        let label = UILabel()
        label.text = text
        label.font = UIFont.systemFont(ofSize: 11, weight: .semibold)
        label.textColor = UIColor(red: 156/255, green: 163/255, blue: 175/255, alpha: 1)
        label.translatesAutoresizingMaskIntoConstraints = false
        addSubview(label)
        NSLayoutConstraint.activate([
            label.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 8),
            label.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -8),
            label.topAnchor.constraint(equalTo: topAnchor, constant: 4),
            label.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -4)
        ])
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

private final class ChordDiagramView: UIView {
    private let positions: [Int?]

    init(chord: String) {
        self.positions = ChordDiagramView.fingering(for: chord)
        super.init(frame: .zero)
        backgroundColor = UIColor(red: 15/255, green: 15/255, blue: 20/255, alpha: 1)
        layer.cornerRadius = 10
        layer.borderWidth = 1
        layer.borderColor = UIColor(red: 42/255, green: 42/255, blue: 47/255, alpha: 1).cgColor
        heightAnchor.constraint(equalToConstant: 70).isActive = true
        widthAnchor.constraint(equalToConstant: 80).isActive = true
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func draw(_ rect: CGRect) {
        guard let ctx = UIGraphicsGetCurrentContext() else { return }
        ctx.setStrokeColor(UIColor(red: 107/255, green: 114/255, blue: 128/255, alpha: 1).cgColor)
        ctx.setLineWidth(1)
        let stringCount = 6
        let fretCount = 5
        let left = rect.minX + 8
        let right = rect.maxX - 8
        let top = rect.minY + 10
        let bottom = rect.maxY - 10
        let stringSpacing = (right - left) / CGFloat(stringCount - 1)
        let fretSpacing = (bottom - top) / CGFloat(fretCount)

        for i in 0..<stringCount {
            let x = left + CGFloat(i) * stringSpacing
            ctx.move(to: CGPoint(x: x, y: top))
            ctx.addLine(to: CGPoint(x: x, y: bottom))
        }
        for fret in 0...fretCount {
            let y = top + CGFloat(fret) * fretSpacing
            ctx.move(to: CGPoint(x: left, y: y))
            ctx.addLine(to: CGPoint(x: right, y: y))
        }
        ctx.strokePath()

        ctx.setFillColor(UIColor.appOrange.cgColor)
        for (index, pos) in positions.enumerated() {
            guard let pos else { continue }
            let x = left + CGFloat(index) * stringSpacing
            let y = top + CGFloat(pos) * fretSpacing - fretSpacing / 2
            ctx.fillEllipse(in: CGRect(x: x - 4, y: y - 4, width: 8, height: 8))
        }
    }

    private static func fingering(for chord: String) -> [Int?] {
        switch chord {
        case "Cmaj7":
            return [nil, 3, 2, 0, 0, 0]
        case "E7":
            return [0, 2, 0, 1, 0, 0]
        case "A7":
            return [0, 0, 2, 0, 2, 0]
        case "Dm7":
            return [nil, nil, 0, 2, 1, 1]
        case "Am7":
            return [0, 0, 2, 0, 1, 0]
        case "D7":
            return [nil, nil, 0, 2, 1, 2]
        case "G7":
            return [3, 2, 0, 0, 0, 1]
        default:
            return [nil, nil, nil, nil, nil, nil]
        }
    }
}
