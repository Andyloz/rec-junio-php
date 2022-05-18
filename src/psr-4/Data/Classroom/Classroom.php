<?php

namespace FAFL\RecJunioPhp\Data\Classroom;

class Classroom
{
  public function __construct(
    public int    $id,
    public string $name,
  )
  {
  }
}