<?php

namespace FAFL\RecJunioPhp\Security;

use Exception;

class Validation
{
  /**
   * @throws Exception
   */
  public function validate(array $parameters): int|array
  {
    foreach ($parameters as $parameter) {

      $val = 0;
      if (is_array($parameter)) {

        if (!array_key_exists('constraints', $parameter)) $parameter['constraints'] = [];
        if (!array_key_exists('messages', $parameter)) $parameter['messages'] = [];

        switch ($parameter['type']) {
          case 'string':
            $val = $this->validateString($parameter['value'], $parameter['name'], $parameter['constraints'], $parameter['messages']);
            break;
          case 'int':
            $val = $this->validateInt($parameter['value'], $parameter['name'], $parameter['constraints'], $parameter['messages']);
            break;
        }
      }

      if ($val == 0) throw new Exception('Error: validation module failed');
      if (is_array($val)) return $val;
    }
    return 1;
  }

  private function validateString($parameter, string $name, array $constraints, array $messages): array|int
  {
    if ($parameter == null || $parameter == '') return $this->checkIfRequired($name, $constraints, $messages);

    if (array_key_exists('min-len', $constraints) && strlen($parameter) < $constraints['min-len']) {
      $msg = 'debe tener al menos' . $constraints['min-len'] . ' caracteres';
      if (array_key_exists('msg-min-len', $messages)) $msg = $messages['msg-min-len'];
      return ['msg' => $name . ' ' . $msg];
    }

    if (array_key_exists('max-len', $constraints) && strlen($parameter) > $constraints['max-len']) {
      $msg = 'debe tener como máximo ' . $constraints['max-len'] . ' caracteres';
      if (array_key_exists('msg-max-len', $messages)) $msg = $messages['msg-max-len'];
      return ['msg' => $name . ' ' . $msg];
    }

    return 1;
  }

  private function validateInt($parameter, string $name, array $constraints, array $messages): array|int
  {
    if ($parameter === null) return $this->checkIfRequired($name, $constraints, $messages);

    if (!is_numeric($parameter)) {
      $msg = 'debe ser un valor numérico';
      if (array_key_exists('msg-not-int', $messages)) $msg = $messages['msg-not int'];
      return ['msg' => $name . ' ' . $msg];
    }

    if (array_key_exists('min-val', $constraints) && $parameter < $constraints['min-val']) {
      $msg = 'debe ser igual o mayor que ' . $constraints['min-val'];
      if (array_key_exists('msg-min-val', $messages)) $msg = $messages['msg-min-val'];
      return ['msg' => $name . ' ' . $msg];
    }

    if (array_key_exists('max-val', $constraints) && $parameter > $constraints['max-val']) {
      $msg = 'debe ser igual o menor que ' . $constraints['max-val'];
      if (array_key_exists('msg-max-val', $messages)) $msg = $messages['msg-max-val'];
      return ['msg' => $name . ' ' . $msg];
    }

    return 1;
  }

  private function checkIfRequired(string $name, array $constraints, array $messages): array|int
  {
    if (!array_key_exists('required', $constraints) || $constraints['required'] == 0) return 1;
    if ($constraints['required'] != 1) return 0;

    $msg = 'es un parámetro requerido';
    if (array_key_exists('msg-required', $messages)) $msg = $messages['msg-required'];
    return ['msg' => $name . ' ' . $msg];
  }
}
