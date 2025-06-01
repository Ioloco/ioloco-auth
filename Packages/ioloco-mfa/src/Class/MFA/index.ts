import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import crypto from 'crypto'

// Error
import promiseResolver from '@/Error/promiseResolver'
import { MFAError } from 'Error/errors'

// Types
import { TempTokenStore, MFAOptions, HashAlgorithms } from '@Types/types'

// =====================================================================================================================

export class MFA {
  private readonly options: Required<MFAOptions>

  constructor(
    private store: TempTokenStore,
    options?: MFAOptions
  ) {
    this.options = {
      issuer: options?.issuer ?? 'Ioloco',
      tempTokenPrefix: options?.tempTokenPrefix ?? 'mfa_temp',
      tempTokenExpirySeconds: options?.tempTokenExpirySeconds ?? 300,
      step: options?.step ?? 30,
      digits: options?.digits ?? 6,
      window: options?.window ?? 1,
      algorithm: (options?.algorithm as HashAlgorithms) ?? 'sha1'
    }

    authenticator.options = {
      step: this.options.step,
      digits: this.options.digits,
      window: this.options.window,

      algorithm: this.options.algorithm,
      secretEncoding: 'base32'
    }
  }

  // =====================================================================================================================
  // =====================================================================================================================

  // ===============================================================
  // Generate Secret
  // ===============================================================
  generateSecret(): string {
    return authenticator.generateSecret()
  }

  // =====================================================================================================================
  // =====================================================================================================================

  // ===============================================================
  // Generate QR Code
  // ===============================================================
  async generateQRCode(secret: string, email: string): Promise<string> {
    const uri = authenticator.keyuri(email, this.options.issuer, secret)
    return QRCode.toDataURL(uri)
  }

  // =====================================================================================================================
  // =====================================================================================================================

  // ===============================================================
  // Verify Token
  // ===============================================================
  verifyToken(secret: string, token: string): boolean {
    return authenticator.verify({ token, secret })
  }

  // =====================================================================================================================
  // =====================================================================================================================

  // ===============================================================
  // Generate Backup Codes
  // ===============================================================
  generateBackupCodes(count = 5): string[] {
    return Array.from({ length: count }, () => crypto.randomBytes(4).toString('hex').toUpperCase())
  }

  // =====================================================================================================================
  // =====================================================================================================================

  // ===============================================================
  // Issue Temporary Token
  // ===============================================================
  async issueTempToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(16).toString('hex')
    const key = `${this.options.tempTokenPrefix}:${token}`

    const [, error] = await promiseResolver(() => this.store.set(key, userId, this.options.tempTokenExpirySeconds))
    if (error) throw new MFAError('Failed to issue temporary token')

    return token
  }

  // =====================================================================================================================
  // =====================================================================================================================

  // ===============================================================
  // Consume Temporary Token
  // ===============================================================
  async consumeTempToken(tempToken: string): Promise<string> {
    const key = `${this.options.tempTokenPrefix}:${tempToken}`

    const [userId, error] = await promiseResolver(() => this.store.get(key))
    if (error || !userId) {
      throw new MFAError('Invalid or expired MFA temp token')
    }

    const [, deleteError] = await promiseResolver(() => this.store.delete(key))
    if (deleteError) {
      throw new MFAError('Failed to delete consumed MFA token')
    }

    return userId
  }

  // =====================================================================================================================
  // =====================================================================================================================
}
