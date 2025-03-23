import Reac, { useState, useRef } from 'react'

const ImageContent = () => {
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [analysing, setAnalysing] = useState(false)
    const [result, setResult] = useState(null)
    const [apiKey, setApiKey] = useState('')
    const [model, setModel] = useState('')

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            const url = URL.createObjectURL(file)
            setPreview(url)
            setResult(null)
        }
    }
    
    const analyzeImage = () => {
        setAnalysing(true)
        
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

            const response = await fetch('')
        }

    }
}