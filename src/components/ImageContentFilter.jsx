import React, { useState } from 'react'
import OpenAI from 'openai'

// インラインスタイル
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1rem',
        maxWidth: '48rem',
        margin: '0 auto',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
    },
    section: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '0.75rem',
    },
    formGroup: {
        marginBottom: '1rem',
    },
    label: {
        display: 'block',
        color: '#4a5568',
        marginBottom: '0.5rem',
    },
    input: {
        width: '100%',
        border: '1px solid #e2e8f0',
        borderRadius: '0.25rem',
        padding: '0.5rem',
    },
    smallText: {
        fontSize: '0.75rem',
        color: '#718096',
        marginTop: '0.25rem',
    },
    buttonPrimary: {
        padding: '0.5rem 1rem',
        backgroundColor: '#4299e1',
        color: 'white',
        borderRadius: '0.25rem',
        cursor: 'pointer',
    },
    buttonDisabled: {
        padding: '0.5rem 1rem',
        backgroundColor: '#cbd5e0',
        color: '#4a5568',
        borderRadius: '0.25rem',
        cursor: 'not-allowed',
    },
    buttonSecondary: {
        padding: '0.5rem 1rem',
        backgroundColor: '#718096',
        color: 'white',
        borderRadius: '0.25rem',
        cursor: 'pointer',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '1rem',
    },
    previewContainer: {
        marginBottom: '1rem',
    },
    previewImage: {
        maxHeight: '16rem',
        margin: '0 auto',
        display: 'block',
    },
    previewFrame: {
        border: '1px solid #e2e8f0',
        borderRadius: '0.25rem',
        padding: '0.5rem',
    },
    errorBox: {
        width: '100%',
        backgroundColor: '#fed7d7',
        border: '1px solid #f56565',
        color: '#c53030',
        padding: '0.75rem 1rem',
        borderRadius: '0.25rem',
        marginBottom: '1.5rem',
    },
    errorBold: {
        fontWeight: 'bold',
    },
    loadingBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinner: {
        display: 'inline-block',
        width: '2.5rem',
        height: '2.5rem',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#e2e8f0',
        borderBottomColor: '#4299e1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        marginLeft: '0.75rem',
    },
    resultSuccess: {
        padding: '1rem',
        borderRadius: '0.25rem',
        marginBottom: '1rem',
        backgroundColor: '#c6f6d5',
    },
    resultError: {
        padding: '1rem',
        borderRadius: '0.25rem',
        marginBottom: '1rem',
        backgroundColor: '#fed7d7',
    },
    bold: {
        fontWeight: 'bold',
    },
    mt2: {
        marginTop: '0.5rem',
    },
    sectionSubtitle: {
        fontWeight: '600',
    },
    paragraphText: {
        color: '#4a5568',
    },
    list: {
        listStyleType: 'disc',
        paddingLeft: '1.25rem',
        marginTop: '0.25rem',
    }
};

const ImageContentFilter = () => {
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [base64Image, setBase64Image] = useState(null)
    const [analysing, setAnalysing] = useState(false)
    const [result, setResult] = useState(null)
    const [apiKey, setApiKey] = useState('')
    const [model, setModel] = useState('gpt-4-vision-preview')
    const [error, setError] = useState(null)

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
            const url = URL.createObjectURL(file)
            setPreview(url)
            setResult(null)
            
            // Base64エンコーディング
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64 = reader.result
                setBase64Image(base64)
            }
            reader.readAsDataURL(file)
        }
    }
    
    const analyzeImage = async () => {
        setAnalysing(true)
        setError(null)
        
        try {
            const prompt = `
            この画像を分析し、以下の点について評価してください:
            1. この画像はインターネット上で公開するのに適切か？
            2. 不適切な内容（暴力、ヌード、グロテスク、差別的内容など）は含まれているか？
            3. 何らかの問題がある場合、具体的に何が問題か？

            以下のJSON形式で回答してください:
            {
                "safe": true/false, // 画像が安全かどうか
                "issues": ["問題点1", "問題点2"], // 問題がある場合のみ記載
                "confidence": 0.9, // 判断の確信度（0.0～1.0）
                "reasoning": "判断理由の詳細説明"
            }
            `

            if (!base64Image) {
                throw new Error('画像が選択されていないか、画像の処理が完了していません')
            }

            const openai = new OpenAI({
                apiKey: apiKey || process.env.API_KEY,
                dangerouslyAllowBrowser: true
            })

            const response = await openai.chat.completions.create({
                model: model || "gpt-4-vision-preview",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            { type: "image_url", image_url: { url: base64Image }}
                        ]
                    }
                ],
                max_tokens: 400,
            })

            const content = response.choices[0].message.content
            if (!content) {
                throw new Error('APIからの応答が空です')
            }

            try {
                const jsonMatch = content.match(/```json\s*([\s\S]*)```/) || content.match(/\{[\s\S]*\}/)
                if (!jsonMatch) {
                    throw new Error('JSONデータが見つかりません')
                }
                
                let jsonContent = jsonMatch[1] || jsonMatch[0]
                jsonContent = jsonContent.replace(/```json\s*|\s*```/g, '').trim()

                const parsedResult = JSON.parse(jsonContent)
                setResult(parsedResult)
            } catch (error) {
                console.error('JSONパースエラー:', error)
                setError(`JSONパースエラー: ${error instanceof Error ? error.message : '不明なエラー'}`)
            }
        } catch (error) {
            console.error('APIエラー:', error)
            setError(`APIエラー: ${error instanceof Error ? error.message : '不明なエラー'}`)
        } finally {
            setAnalysing(false)
        }
    }

    const resetForm = () => {
        setImage(null)
        setPreview(null)
        setBase64Image(null)
        setResult(null)
        setError(null)
    }

    return (
        <div style={styles.container}>
        <h1 style={styles.title}>画像評価・フィルタリングアプリ</h1>
        
        {/* API設定セクション */}
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>OpenAI API設定</h2>
            
            <div style={styles.formGroup}>
            <label style={styles.label}>APIキー:</label>
            <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                style={styles.input}
            />
            <p style={styles.smallText}>
                ※APIキーはクライアント側でのみ使用され、サーバーには保存されません
            </p>
            </div>
            
            <div style={styles.formGroup}>
            <label style={styles.label}>モデル:</label>
            <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                style={styles.input}
            >
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4o-mini">GPT-4o Mini</option>
            </select>
            </div>
        </div>
        
        {/* 画像アップロードセクション */}
        <div style={styles.section}>
            <div style={styles.formGroup}>
            <label style={styles.label}>画像をアップロード:</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={styles.input}
            />
            </div>
            
            {preview && (
            <div style={styles.previewContainer}>
                <h2 style={styles.sectionTitle}>プレビュー:</h2>
                <div style={styles.previewFrame}>
                <img src={preview} alt="Preview" style={styles.previewImage} />
                </div>
            </div>
            )}
            
            <div style={styles.buttonContainer}>
            <button
                onClick={analyzeImage}
                disabled={!image || !apiKey || analysing}
                style={!image || !apiKey || analysing ? styles.buttonDisabled : styles.buttonPrimary}
            >
                {analysing ? '分析中...' : '画像を分析'}
            </button>
            
            <button
                onClick={resetForm}
                style={styles.buttonSecondary}
            >
                リセット
            </button>
            </div>
        </div>
        
        {/* エラーメッセージ */}
        {error && (
            <div style={styles.errorBox}>
            <strong style={styles.errorBold}>エラー:</strong>
            <span> {error}</span>
            </div>
        )}
        
        {/* 読み込み中インジケーター */}
        {analysing && (
            <div style={styles.section}>
            <div style={styles.loadingBox}>
                <div style={styles.spinner}></div>
                <span style={styles.loadingText}>画像を分析中...</span>
            </div>
            </div>
        )}
        
        {/* 分析結果 */}
        {result && (
            <div style={styles.section}>
            <h2 style={styles.sectionTitle}>分析結果:</h2>
            
            <div style={result.safe ? styles.resultSuccess : styles.resultError}>
                <div style={styles.bold}>
                {result.safe ? '✅ この画像は安全です' : '⚠️ この画像に問題が見つかりました'}
                </div>
                <div style={styles.mt2}>
                信頼度: {(result.confidence * 100).toFixed(1)}%
                </div>
                
                {result.reasoning && (
                <div style={styles.mt2}>
                    <div style={styles.sectionSubtitle}>判断理由:</div>
                    <p style={styles.mt2}>{result.reasoning}</p>
                </div>
                )}
                
                {!result.safe && result.issues?.length > 0 && (
                <div style={styles.mt2}>
                    <div style={styles.sectionSubtitle}>検出された問題:</div>
                    <ul style={styles.list}>
                    {result.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                    ))}
                    </ul>
                </div>
                )}
            </div>
            </div>
        )}
        
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>このアプリについて</h2>
            <p style={styles.paragraphText}>
            このアプリでは、アップロードされた画像がネット上での使用に適しているかをOpenAI APIを使用して評価します。
            分析にはユーザー自身のAPIキーが必要です。
            </p>
            <p style={{...styles.paragraphText, marginTop: '0.5rem'}}>
            <strong>セキュリティについて:</strong> APIキーはクライアントサイドでのみ使用され、サーバーには保存されません。
            プロダクション環境では、APIキーの取り扱いにはより安全なバックエンド連携が推奨されます。
            </p>
        </div>
        </div>
    )
}

export default ImageContentFilter 