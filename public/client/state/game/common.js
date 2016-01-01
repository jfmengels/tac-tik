import u from 'updeep'

export const atPos = (wanted, position) =>
  ({pos, isAtDestination}) =>
    (pos === position) === wanted && !isAtDestination

export const removeAtPosition = (position, state) => {
  let updater = {
    pieces: (p) => p.filter(atPos(false, position)),
    error: null
  }

  const piecesAtGivenPosition = state.pieces.filter(atPos(true, position))
  if (piecesAtGivenPosition.length === 1) {
    const {player, isBlocking} = piecesAtGivenPosition[0]
    if (isBlocking) {
      updater = {
        error: `Can't remove a blocking piece from the board`
      }
    } else {
      updater.players = {
        [player]: {
          piecesInStock: (n) => n + 1
        }
      }
    }
  }
  return u(updater, state)
}

export const conditionalUpdater = (updater) =>
  (state) => {
    if (state.error) { return state }
    return u(updater, state)
  }
