<?php

namespace FAFL\RecJunioPhp\Data\User;

class User
{
  public function __construct(
    public int $id,
    public string $name,
  )
  {
  }
}