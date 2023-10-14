import { UpdateSignInTokenController } from '~/controllers/auth'
import { UpdateSignInToken } from '~/usecases/auth/update-sign-in-token'

export const makeSignInTokenController = () => {
  const updateSignInToken = new UpdateSignInToken()
  const updateSignInTokenController = new UpdateSignInTokenController(updateSignInToken)

  return updateSignInTokenController
}
