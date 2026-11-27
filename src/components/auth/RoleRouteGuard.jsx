import React, { useEffect, useRef } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import useAppStore, { getRolePath } from '../../store/useStore'
import { toast } from '../ui/Toast'

const hasStoredDemoUser = () => {
    try {
        const raw = localStorage.getItem('user')
        if (!raw) return false
        const parsed = JSON.parse(raw)
        return Boolean(parsed && typeof parsed === 'object' && parsed.role)
    } catch {
        return false
    }
}

/**
 * Frontend-only demonstration route guard.
 * Enforces simulated session presence and prevents URL-based role switching.
 */
const RoleRouteGuard = () => {
    const { isAuthenticated, role } = useAppStore()
    const { rolePath } = useParams()
    const location = useLocation()
    const lastBlockedPathRef = useRef('')

    const sessionActive = isAuthenticated && hasStoredDemoUser()
    const expectedRolePath = getRolePath(role)
    const isRoleMismatch = sessionActive && rolePath && rolePath !== expectedRolePath

    useEffect(() => {
        if (isRoleMismatch && lastBlockedPathRef.current !== location.pathname) {
            lastBlockedPathRef.current = location.pathname
            toast.warning(`Demo access restricted for "/${rolePath}". Redirected to your active workspace.`)
        }
    }, [isRoleMismatch, location.pathname, rolePath])

    if (!sessionActive) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }

    if (isRoleMismatch) {
        return <Navigate to={`/${expectedRolePath}/dashboard`} replace />
    }

    return <Outlet />
}

export default RoleRouteGuard
