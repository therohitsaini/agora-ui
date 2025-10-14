export const formatDateTime = (isoString) => {
    if (!isoString) return '-'
    const d = new Date(isoString)
    if (Number.isNaN(d.getTime())) return '-'
    return d.toLocaleString()
}

export const formatSeconds = (totalSeconds) => {
    if (typeof totalSeconds !== 'number' || !Number.isFinite(totalSeconds)) return '-'
    const seconds = Math.max(0, Math.floor(totalSeconds))
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hrs > 0) return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    return `${mins}:${String(secs).padStart(2, '0')}`
}

export const deriveDurationSeconds = (startTime, endTime, durationSeconds) => {
    if (typeof durationSeconds === 'number') return durationSeconds
    if (startTime && endTime) {
        const start = new Date(startTime).getTime()
        const end = new Date(endTime).getTime()
        if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
            return Math.floor((end - start) / 1000)
        }
    }
    return undefined
}
